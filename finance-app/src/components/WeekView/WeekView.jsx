/**
 * WeekView
 * Last 7 Days tab:
 *   - Top row: compact CompanyCards (price + change only)
 *   - Bottom: multi-company overlay ComparisonChart
 *   - Each card also shows its 7-day % move vs first point
 */
import { useCallback, useEffect, useState } from 'react'
import CompanyCard from '../CompanyCard/CompanyCard'
import ComparisonChart from '../ComparisonChart/ComparisonChart'
import { COMPANIES, COMPANY_COLORS } from '../../constants/companies'
import { useHistory } from '../../hooks/useHistory'
import styles from './WeekView.module.css'

// Silent loader — collects one ticker's series and reports it up via useEffect
function SeriesLoader({ ticker, onLoaded }) {
  const { series } = useHistory(ticker, '7d')
  useEffect(() => {
    if (series.length > 0) onLoaded(ticker, series)
  }, [ticker, series, onLoaded])
  return null
}

function weekMove(series) {
  if (!series || series.length < 2) return null
  const first = series[0].close
  const last  = series[series.length - 1].close
  return ((last - first) / first) * 100
}

function WeekMoveChip({ series }) {
  const pct = weekMove(series)
  if (pct === null) return null
  const positive = pct >= 0
  return (
    <span className={`${styles.chip} ${positive ? styles.chipUp : styles.chipDown}`}>
      {positive ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}% (7d)
    </span>
  )
}

function WeekView() {
  const [seriesMap, setSeriesMap] = useState({})
  const handleLoaded = useCallback((ticker, series) => {
    setSeriesMap((prev) => ({ ...prev, [ticker]: series }))
  }, [])

  return (
    <div className={styles.view}>
      {/* Silent series loaders */}
      {COMPANIES.map(({ ticker }) => (
        <SeriesLoader key={ticker} ticker={ticker} onLoaded={handleLoaded} />
      ))}

      {/* ── Compact cards with 7d move chip ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7-Day Performance</h2>
        <div className={styles.cardRow}>
          {COMPANIES.map(({ ticker, name }, i) => (
            <div key={ticker} className={styles.cardWrap}>
              <CompanyCard ticker={ticker} name={name} compact />
              <div className={styles.chipRow}>
                <span
                  className={styles.colorDot}
                  style={{ background: COMPANY_COLORS[i] }}
                />
                <WeekMoveChip series={seriesMap[ticker]} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Multi-company line chart ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7-Day Price Comparison</h2>
        <div className={styles.chartCard}>
          <ComparisonChart
            companies={COMPANIES}
            seriesMap={seriesMap}
            colors={COMPANY_COLORS}
            height={320}
          />
        </div>
      </section>
    </div>
  )
}

export default WeekView
