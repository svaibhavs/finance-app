/**
 * QuarterView
 * Last Quarter tab:
 *   - Normalised % return comparison chart (all companies rebased to 0% at start)
 *   - Performance rank table: rank, company, start price, end price, return %
 */
import { useCallback, useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { COMPANIES, COMPANY_COLORS } from '../../constants/companies'
import { useHistory } from '../../hooks/useHistory'
import styles from './QuarterView.module.css'

// Silent loader — reports series up via useEffect
function SeriesLoader({ ticker, onLoaded }) {
  const { series } = useHistory(ticker, 'quarter')
  useEffect(() => {
    if (series.length > 0) onLoaded(ticker, series)
  }, [ticker, series, onLoaded])
  return null
}

/** Rebase a series so the first close = 0%, each subsequent point = % change from start */
function rebaseSeries(series) {
  if (!series || series.length === 0) return []
  const base = series[0].close
  if (base === 0) return []
  return series.map(({ date, close }) => ({
    date,
    return: +((( close - base) / base) * 100).toFixed(3),
  }))
}

/** Build merged dataset: [{ date, IBM: 2.3, MSFT: -1.1, ... }] */
function buildNormalisedData(companies, seriesMap) {
  const rebased = {}
  companies.forEach(({ ticker }) => {
    rebased[ticker] = rebaseSeries(seriesMap[ticker] ?? [])
  })

  const dateSet = new Set()
  Object.values(rebased).forEach((s) => s.forEach(({ date }) => dateSet.add(date)))
  const dates = Array.from(dateSet).sort()

  return dates.map((date) => {
    const row = { date }
    companies.forEach(({ ticker }) => {
      const pt = rebased[ticker].find((p) => p.date === date)
      row[ticker] = pt ? pt.return : null
    })
    return row
  })
}

/** Build performance rank rows sorted by return desc */
function buildRankData(companies, seriesMap) {
  return companies
    .map(({ ticker, name }, i) => {
      const s = seriesMap[ticker] ?? []
      if (s.length < 2) return { ticker, name, color: COMPANY_COLORS[i], startPrice: null, endPrice: null, returnPct: null }
      const startPrice = s[0].close
      const endPrice   = s[s.length - 1].close
      const returnPct  = ((endPrice - startPrice) / startPrice) * 100
      return { ticker, name, color: COMPANY_COLORS[i], startPrice, endPrice, returnPct }
    })
    .filter((r) => r.returnPct !== null)
    .sort((a, b) => b.returnPct - a.returnPct)
}

function RankTable({ rows }) {
  if (rows.length === 0) return <p className={styles.empty}>Loading data…</p>
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>#</th>
          <th>Company</th>
          <th>Start</th>
          <th>End</th>
          <th>Return</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ ticker, name, color, startPrice, endPrice, returnPct }, i) => (
          <tr key={ticker}>
            <td className={styles.rank}>{i + 1}</td>
            <td>
              <span className={styles.dot} style={{ background: color }} />
              <span className={styles.tickerCell}>{ticker}</span>
              <span className={styles.nameCell}>{name}</span>
            </td>
            <td className={styles.num}>${startPrice.toFixed(2)}</td>
            <td className={styles.num}>${endPrice.toFixed(2)}</td>
            <td className={`${styles.num} ${returnPct >= 0 ? styles.pos : styles.neg}`}>
              {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function QuarterView() {
  const [seriesMap, setSeriesMap] = useState({})
  const handleLoaded = useCallback((ticker, series) => {
    setSeriesMap((prev) => ({ ...prev, [ticker]: series }))
  }, [])

  const normData = buildNormalisedData(COMPANIES, seriesMap)
  const rankRows = buildRankData(COMPANIES, seriesMap)

  return (
    <div className={styles.view}>
      {COMPANIES.map(({ ticker }) => (
        <SeriesLoader key={ticker} ticker={ticker} onLoaded={handleLoaded} />
      ))}

      {/* ── Normalised return chart ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quarterly Return Comparison</h2>
        <p className={styles.chartNote}>
          All companies rebased to 0% at the start of the period — shows relative performance, not absolute price.
        </p>
        <div className={styles.chartCard}>
          {normData.length === 0
            ? <div className={styles.empty}>Loading…</div>
            : (
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={normData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <ReferenceLine y={0} stroke="#8b949e" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#57606a' }}
                    tickFormatter={(d) => d.slice(5)}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#57606a' }}
                    tickFormatter={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`}
                    domain={['auto', 'auto']}
                    width={58}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value >= 0 ? '+' : ''}${Number(value).toFixed(2)}%`,
                      name,
                    ]}
                    labelStyle={{ fontSize: 12 }}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {COMPANIES.map(({ ticker }, i) => (
                    <Line
                      key={ticker}
                      type="monotone"
                      dataKey={ticker}
                      stroke={COMPANY_COLORS[i]}
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </section>

      {/* ── Performance rank table ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Performance Ranking</h2>
        <div className={styles.tableCard}>
          <RankTable rows={rankRows} />
        </div>
      </section>
    </div>
  )
}

export default QuarterView
