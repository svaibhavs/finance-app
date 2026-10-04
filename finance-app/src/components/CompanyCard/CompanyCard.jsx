import { useQuote } from '../../hooks/useQuote'
import { fmt, fmtVol, fmtCap } from '../../utils/formatters'
import styles from './CompanyCard.module.css'

function MarketStateBadge({ state }) {
  const label = state === 'REGULAR' ? 'Market Open' : state === 'PRE' ? 'Pre-Market' : state === 'POST' ? 'After Hours' : 'Closed'
  const mod   = state === 'REGULAR' ? styles.stateOpen : styles.stateClosed
  return <span className={`${styles.stateBadge} ${mod}`}>{label}</span>
}

function Week52Bar({ low, high, current }) {
  const range = high - low
  if (range <= 0) return null
  const pct = Math.min(100, Math.max(0, ((current - low) / range) * 100))
  return (
    <div className={styles.weekBar}>
      <span className={styles.weekLabel}>${fmt(low)}</span>
      <div className={styles.weekTrack}>
        <div className={styles.weekFill} style={{ width: `${pct}%` }} />
        <div className={styles.weekDot} style={{ left: `${pct}%` }} />
      </div>
      <span className={styles.weekLabel}>${fmt(high)}</span>
    </div>
  )
}

function CompanyCard({ ticker, name, compact = false }) {
  const { quote, loading, error } = useQuote(ticker)

  if (loading) {
    return (
      <div className={`${styles.card} ${styles.loading}`}>
        <span className={styles.ticker}>{ticker}</span>
        <span className={styles.placeholder}>Loading…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${styles.card} ${styles.errored}`}>
        <span className={styles.ticker}>{ticker}</span>
        <span className={styles.errorMsg}>{error}</span>
      </div>
    )
  }

  const positive = quote.change >= 0
  const sign     = positive ? '+' : ''

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''}`} data-testid={`company-card-${ticker}`}>
      {/* ── Header ── */}
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.ticker}>{ticker}</span>
          <span className={styles.name}>{name}</span>
        </div>
        <MarketStateBadge state={quote.marketState} />
      </div>

      {/* ── Price + Change ── */}
      <div className={styles.priceRow}>
        <span className={styles.price}>${fmt(quote.price)}</span>
        <span className={`${styles.change} ${positive ? styles.positive : styles.negative}`}>
          {sign}{fmt(quote.change)} ({sign}{fmt(quote.changePercent)}%)
        </span>
      </div>

      {!compact && (
        <>
          {/* ── OHLC row ── */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Open</span>
              <span className={styles.metaValue}>${fmt(quote.open)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>High</span>
              <span className={`${styles.metaValue} ${styles.positive}`}>${fmt(quote.dayHigh)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Low</span>
              <span className={`${styles.metaValue} ${styles.negative}`}>${fmt(quote.dayLow)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Prev Close</span>
              <span className={styles.metaValue}>${fmt(quote.previousClose)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Volume</span>
              <span className={styles.metaValue}>{fmtVol(quote.volume)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Mkt Cap</span>
              <span className={styles.metaValue}>{fmtCap(quote.marketCap)}</span>
            </div>
          </div>

          {/* ── 52-week bar ── */}
          <div className={styles.weekSection}>
            <span className={styles.metaLabel}>52-Week Range</span>
            <Week52Bar low={quote.week52Low} high={quote.week52High} current={quote.price} />
          </div>
        </>
      )}
    </div>
  )
}

export default CompanyCard
