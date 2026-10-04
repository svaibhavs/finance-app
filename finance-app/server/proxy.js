/**
 * proxy.js
 * Express proxy for Yahoo Finance data — uses yahoo-finance2 v4.
 * Runs on port 3001 — Vite dev server forwards /api/* here.
 *
 * Routes:
 *   GET  /health
 *   GET  /api/finance/quote/:ticker
 *   GET  /api/finance/quotes?tickers=IBM,MSFT,ORCL
 *   GET  /api/finance/history/:ticker?window=7d|quarter
 */
import express from 'express'
import YahooFinance from 'yahoo-finance2'

// v4: must instantiate; suppress the one-time survey notice
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

const app = express()
const PORT = process.env.PORT ?? 3001

// ── CORS (dev only — Vite proxy handles this in production builds) ─────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  next()
})

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() })
})

// ── Single quote ──────────────────────────────────────────────────────────
app.get('/api/finance/quote/:ticker', async (req, res) => {
  const { ticker } = req.params
  if (!isValidTicker(ticker)) {
    return res.status(400).json({ error: `Invalid ticker: ${ticker}` })
  }
  try {
    const result = await yahooFinance.quote(ticker.toUpperCase())
    res.json(result)
  } catch (err) {
    res.status(502).json({ error: `Failed to fetch quote for ${ticker}: ${err.message}` })
  }
})

// ── Bulk quotes ───────────────────────────────────────────────────────────
app.get('/api/finance/quotes', async (req, res) => {
  const raw = req.query.tickers ?? ''
  const tickers = raw.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean)

  if (tickers.length === 0) {
    return res.status(400).json({ error: 'Provide at least one ticker via ?tickers=IBM,MSFT' })
  }
  if (tickers.length > 20) {
    return res.status(400).json({ error: 'Maximum 20 tickers per batch request' })
  }

  const results = await Promise.all(
    tickers.map(async (ticker) => {
      if (!isValidTicker(ticker)) return [ticker, { error: `Invalid ticker: ${ticker}` }]
      try {
        const data = await yahooFinance.quote(ticker)
        return [ticker, data]
      } catch (err) {
        return [ticker, { error: err.message }]
      }
    })
  )
  res.json(Object.fromEntries(results))
})

// ── History ───────────────────────────────────────────────────────────────
app.get('/api/finance/history/:ticker', async (req, res) => {
  const { ticker } = req.params
  const window = req.query.window ?? '7d'

  if (!isValidTicker(ticker)) {
    return res.status(400).json({ error: `Invalid ticker: ${ticker}` })
  }

  const today = new Date()
  let period1

  if (window === '7d') {
    period1 = daysAgo(today, 10)
  } else if (window === 'quarter') {
    period1 = daysAgo(today, 130)
  } else {
    return res.status(400).json({ error: `Unknown window: ${window}. Use '7d' or 'quarter'.` })
  }

  try {
    const result = await yahooFinance.historical(ticker.toUpperCase(), {
      period1: period1.toISOString().slice(0, 10),
      period2: today.toISOString().slice(0, 10),
      interval: '1d',
    })
    res.json(result)
  } catch (err) {
    res.status(502).json({ error: `Failed to fetch history for ${ticker}: ${err.message}` })
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────

function isValidTicker(ticker) {
  return /^[A-Z0-9]{1,10}$/.test(ticker)
}

function daysAgo(from, n) {
  const d = new Date(from)
  d.setDate(d.getDate() - n)
  return d
}

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Finance proxy running on http://localhost:${PORT}`)
  console.log(`  GET /health`)
  console.log(`  GET /api/finance/quote/:ticker`)
  console.log(`  GET /api/finance/quotes?tickers=IBM,MSFT`)
  console.log(`  GET /api/finance/history/:ticker?window=7d|quarter`)
})
