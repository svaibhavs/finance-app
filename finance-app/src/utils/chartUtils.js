/**
 * chartUtils.js
 * Pure data-transformation helpers for chart components.
 * Extracted here so they are independently testable and don't
 * trigger the react-refresh/only-export-components lint rule.
 */

/**
 * mergeSeriesMap
 * Merges per-ticker HistoryPoint arrays into a single flat array
 * suitable for a Recharts multi-line chart.
 *
 * Input:
 *   companies  [{ ticker }]
 *   seriesMap  { [ticker]: [{ date, close, ... }] }
 *
 * Output:
 *   [{ date, IBM: 182, MSFT: 415, ... }]  — null for missing dates
 */
export function mergeSeriesMap(companies, seriesMap) {
  const dateSet = new Set()
  companies.forEach(({ ticker }) => {
    (seriesMap[ticker] ?? []).forEach(({ date }) => dateSet.add(date))
  })
  const dates = Array.from(dateSet).sort()

  return dates.map((date) => {
    const row = { date }
    companies.forEach(({ ticker }) => {
      const point = (seriesMap[ticker] ?? []).find((p) => p.date === date)
      row[ticker] = point ? point.close : null
    })
    return row
  })
}
