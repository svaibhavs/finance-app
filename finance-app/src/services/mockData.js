/**
 * mockData.js
 * Deterministic static data snapshot used when VITE_USE_MOCK=true.
 *
 * Series are seeded with a simple LCG so they produce the same shape
 * on every module load — tests stay reproducible, charts look realistic.
 *
 * All quote fields match the full QuoteShape from normalizeQuote.js.
 * To add a new company: add an entry to MOCK_QUOTES and MOCK_HISTORIES,
 * matching the ticker used in constants/companies.js.
 */

// ── Deterministic pseudo-random number generator (LCG) ───────────────────
function makePrng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

/**
 * Generate a deterministic OHLCV series.
 * @param {number} startPrice  — starting close price
 * @param {number} days        — number of trading days
 * @param {number} seed        — PRNG seed (use a fixed number per ticker/window)
 */
function makeSeries(startPrice, days, seed) {
  const rand = makePrng(seed)
  const result = []
  let price = startPrice
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const date = d.toISOString().slice(0, 10)

    // Skip weekends for realism
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue

    const dailyMove = (rand() - 0.49) * 0.022
    price = +(price * (1 + dailyMove)).toFixed(2)

    const open   = +(price * (1 + (rand() - 0.5) * 0.005)).toFixed(2)
    const high   = +(Math.max(open, price) * (1 + rand() * 0.006)).toFixed(2)
    const low    = +(Math.min(open, price) * (1 - rand() * 0.006)).toFixed(2)
    const volume = Math.round(3_000_000 + rand() * 7_000_000)

    result.push({ date, open, high, low, close: price, volume })
  }
  return result
}

// ── Quote snapshots ───────────────────────────────────────────────────────
export const MOCK_QUOTES = {
  IBM: {
    ticker: 'IBM',  name: 'International Business Machines',
    price: 182.45,  change: 1.23,   changePercent: 0.68,
    previousClose: 181.22, open: 181.50, dayHigh: 183.10, dayLow: 180.95,
    volume: 4_230_000, avgVolume: 4_800_000,
    marketCap: 167_000_000_000,
    week52High: 199.18, week52Low: 135.87,
    currency: 'USD', exchange: 'New York Stock Exchange', marketState: 'CLOSED',
  },
  MSFT: {
    ticker: 'MSFT', name: 'Microsoft Corporation',
    price: 415.32,  change: -2.10,  changePercent: -0.50,
    previousClose: 417.42, open: 417.00, dayHigh: 418.55, dayLow: 414.10,
    volume: 18_500_000, avgVolume: 21_000_000,
    marketCap: 3_090_000_000_000,
    week52High: 468.35, week52Low: 309.45,
    currency: 'USD', exchange: 'NASDAQ', marketState: 'CLOSED',
  },
  ORCL: {
    ticker: 'ORCL', name: 'Oracle Corporation',
    price: 135.78,  change: 0.55,   changePercent: 0.41,
    previousClose: 135.23, open: 135.00, dayHigh: 136.40, dayLow: 134.80,
    volume: 6_100_000, avgVolume: 7_200_000,
    marketCap: 372_000_000_000,
    week52High: 164.95, week52Low: 103.22,
    currency: 'USD', exchange: 'New York Stock Exchange', marketState: 'CLOSED',
  },
  SAP: {
    ticker: 'SAP',  name: 'SAP SE',
    price: 198.90,  change: 3.20,   changePercent: 1.64,
    previousClose: 195.70, open: 196.00, dayHigh: 199.50, dayLow: 195.30,
    volume: 1_950_000, avgVolume: 2_100_000,
    marketCap: 240_000_000_000,
    week52High: 210.80, week52Low: 132.40,
    currency: 'USD', exchange: 'New York Stock Exchange', marketState: 'CLOSED',
  },
  CRM: {
    ticker: 'CRM',  name: 'Salesforce Inc.',
    price: 248.60,  change: -1.80,  changePercent: -0.72,
    previousClose: 250.40, open: 250.00, dayHigh: 251.20, dayLow: 247.90,
    volume: 5_800_000, avgVolume: 6_500_000,
    marketCap: 240_000_000_000,
    week52High: 318.71, week52Low: 193.54,
    currency: 'USD', exchange: 'New York Stock Exchange', marketState: 'CLOSED',
  },
}

// ── Historical series ─────────────────────────────────────────────────────
// Seeds are fixed per-ticker per-window so data is deterministic across reloads.
export const MOCK_HISTORIES = {
  IBM:  { '7d': makeSeries(178, 10,  1001), quarter: makeSeries(165, 130, 1002) },
  MSFT: { '7d': makeSeries(420, 10,  2001), quarter: makeSeries(390, 130, 2002) },
  ORCL: { '7d': makeSeries(132, 10,  3001), quarter: makeSeries(120, 130, 3002) },
  SAP:  { '7d': makeSeries(194, 10,  4001), quarter: makeSeries(180, 130, 4002) },
  CRM:  { '7d': makeSeries(252, 10,  5001), quarter: makeSeries(235, 130, 5002) },
}
