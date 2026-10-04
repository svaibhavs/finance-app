/**
 * normalizeQuote.js
 * Maps a raw yahoo-finance2 quote result to the app's stable QuoteShape.
 *
 * QuoteShape:
 *   ticker         string   — e.g. "IBM"
 *   name           string   — display name, e.g. "International Business Machines"
 *   price          number   — current / last market price
 *   change         number   — absolute change from previous close
 *   changePercent  number   — percent change from previous close
 *   previousClose  number   — prior session close
 *   open           number   — session open price
 *   dayHigh        number   — session high
 *   dayLow         number   — session low
 *   volume         number   — session volume
 *   avgVolume      number   — 3-month average daily volume
 *   marketCap      number   — market capitalisation in USD
 *   week52High     number   — 52-week high
 *   week52Low      number   — 52-week low
 *   currency       string   — e.g. "USD"
 *   exchange       string   — e.g. "NYQ"
 *   marketState    string   — "REGULAR" | "PRE" | "POST" | "CLOSED"
 */
export function normalizeQuote(raw) {
  if (!raw || typeof raw !== 'object') {
    return { error: 'Invalid quote data received' }
  }
  return {
    ticker:        raw.symbol                         ?? '',
    name:          raw.shortName ?? raw.longName ?? raw.symbol ?? '',
    price:         toNumber(raw.regularMarketPrice),
    change:        toNumber(raw.regularMarketChange),
    changePercent: toNumber(raw.regularMarketChangePercent),
    previousClose: toNumber(raw.regularMarketPreviousClose ?? raw.previousClose),
    open:          toNumber(raw.regularMarketOpen),
    dayHigh:       toNumber(raw.regularMarketDayHigh),
    dayLow:        toNumber(raw.regularMarketDayLow),
    volume:        toNumber(raw.regularMarketVolume),
    avgVolume:     toNumber(raw.averageDailyVolume3Month ?? raw.averageVolume),
    marketCap:     toNumber(raw.marketCap),
    week52High:    toNumber(raw.fiftyTwoWeekHigh),
    week52Low:     toNumber(raw.fiftyTwoWeekLow),
    currency:      raw.currency    ?? 'USD',
    exchange:      raw.fullExchangeName ?? raw.exchange ?? '',
    marketState:   raw.marketState ?? 'CLOSED',
  }
}

/** Safely coerce a value to a number; returns 0 for null/undefined/NaN. */
function toNumber(val) {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}
