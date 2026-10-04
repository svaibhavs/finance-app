/**
 * normalizeHistory.js
 * Maps a raw yahoo-finance2 historical array to the app's stable HistoryPoint[].
 *
 * HistoryPoint:
 *   date    string  — ISO date, e.g. "2024-03-01"
 *   open    number  — session open
 *   high    number  — session high
 *   low     number  — session low
 *   close   number  — adjusted close
 *   volume  number  — session volume
 *
 * The close field is the primary value used by line charts.
 * open/high/low/volume are retained so the data is candlestick-ready
 * without requiring a fresh fetch when chart types are extended.
 */
export function normalizeHistory(rawItems) {
  if (!Array.isArray(rawItems)) return []
  return rawItems
    .filter((item) => item != null && item.close != null)
    .map((item) => ({
      date:   toDateString(item.date),
      open:   toNumber(item.open),
      high:   toNumber(item.high),
      low:    toNumber(item.low),
      close:  toNumber(item.close),
      volume: toNumber(item.volume),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * normalizeHistoryForTicker
 * Convenience wrapper that tags each point with its source ticker.
 * Useful when merging multi-company series into a single dataset.
 *
 * @param {object[]} rawItems
 * @param {string}   ticker
 * @returns {{ date, open, high, low, close, volume, ticker }[]}
 */
export function normalizeHistoryForTicker(rawItems, ticker) {
  return normalizeHistory(rawItems).map((point) => ({ ...point, ticker }))
}

// ── Helpers ───────────────────────────────────────────────────────────────

function toNumber(val) {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

function toDateString(val) {
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  // Some yahoo-finance2 versions return epoch ms as a number
  if (typeof val === 'number') return new Date(val).toISOString().slice(0, 10)
  return String(val).slice(0, 10)
}
