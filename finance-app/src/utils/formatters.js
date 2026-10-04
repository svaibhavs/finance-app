/**
 * formatters.js
 * Pure formatting helpers used by CompanyCard and other display components.
 * Extracted here so they can be unit-tested independently of React.
 */

/** Format a number to 2 decimal places, e.g. 182.4 → "182.40" */
export function fmt(n) {
  return Number(n).toFixed(2)
}

/**
 * Format a volume number with M/K suffix.
 * 4230000 → "4.2M", 850000 → "850K", 500 → "500"
 */
export function fmtVol(n) {
  const v = Number(n)
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`
  return String(v)
}

/**
 * Format a market-cap number with T/B/M suffix.
 * 3_090_000_000_000 → "$3.09T", 167_000_000_000 → "$167.0B"
 */
export function fmtCap(n) {
  const v = Number(n)
  if (v >= 1_000_000_000_000) return `$${(v / 1_000_000_000_000).toFixed(2)}T`
  if (v >= 1_000_000_000)     return `$${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000)         return `$${(v / 1_000_000).toFixed(0)}M`
  return `$${v}`
}

/**
 * Format a signed percentage change for display.
 * 0.68 → "+0.68%", -0.50 → "-0.50%"
 */
export function fmtPct(n) {
  const v = Number(n)
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toFixed(2)}%`
}
