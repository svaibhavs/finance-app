/**
 * financeService.js
 * Public data API for the finance dashboard.
 *
 * All hooks and components import from here — never from the adapter directly.
 * Switch between live Yahoo Finance data and deterministic mock data by setting
 * VITE_USE_MOCK=true in .env.local.
 *
 * ── Exported API ──────────────────────────────────────────────────────────
 *
 *  getQuote(ticker)
 *    → QuoteShape | { error: string }
 *    Fetch the current quote for a single ticker.
 *
 *  getQuotes(tickers[])
 *    → { [ticker]: QuoteShape | { error: string } }
 *    Batch-fetch quotes for multiple tickers. Returns a map keyed by ticker.
 *    Internally runs all fetches in parallel; a failure for one ticker does
 *    not block the others.
 *
 *  getHistory(ticker, window)
 *    → HistoryPoint[] | { error: string }
 *    window: 'day' | '7d' | 'quarter'
 *    'day' always returns [] — current-day view is served by getQuote alone.
 *
 *  getSummary(ticker)
 *    → SummaryShape | { error: string }
 *    Enriched data bundle: quote + short-term history + quarterly history.
 *    Use when a component needs all three in a single call.
 */
import { fetchQuote, fetchHistory } from './yahooFinanceAdapter'
import { MOCK_QUOTES, MOCK_HISTORIES } from './mockData'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// ── Single quote ──────────────────────────────────────────────────────────

export async function getQuote(ticker) {
  if (USE_MOCK) {
    const quote = MOCK_QUOTES[ticker.toUpperCase()]
    if (!quote) return { error: `Unknown symbol: ${ticker}` }
    return quote
  }
  try {
    return await fetchQuote(ticker)
  } catch (err) {
    return { error: err.message }
  }
}

// ── Batch quotes ──────────────────────────────────────────────────────────

/**
 * getQuotes — fetch multiple tickers in parallel.
 * Returns { IBM: QuoteShape, MSFT: QuoteShape | { error }, … }
 * A partial failure only affects that ticker's entry.
 */
export async function getQuotes(tickers) {
  const entries = await Promise.all(
    tickers.map(async (ticker) => [ticker, await getQuote(ticker)])
  )
  return Object.fromEntries(entries)
}

// ── History ───────────────────────────────────────────────────────────────

export async function getHistory(ticker, window) {
  if (window === 'day') return []   // current-day view uses quote snapshot only

  if (USE_MOCK) {
    const histories = MOCK_HISTORIES[ticker.toUpperCase()]
    if (!histories) return { error: `Unknown symbol: ${ticker}` }
    return histories[window] ?? { error: `Unknown window: ${window}` }
  }
  try {
    return await fetchHistory(ticker, window)
  } catch (err) {
    return { error: err.message }
  }
}

// ── Summary bundle ────────────────────────────────────────────────────────

/**
 * getSummary — returns a combined data bundle for a single ticker:
 *   { quote, weekHistory, quarterHistory }
 *
 * weekHistory    — HistoryPoint[] for the last 7 days
 * quarterHistory — HistoryPoint[] for the last 90 days
 *
 * Any sub-fetch that fails returns { error } in its slot without
 * blocking the others.
 */
export async function getSummary(ticker) {
  const [quote, weekHistory, quarterHistory] = await Promise.all([
    getQuote(ticker),
    getHistory(ticker, '7d'),
    getHistory(ticker, 'quarter'),
  ])
  return { quote, weekHistory, quarterHistory }
}
