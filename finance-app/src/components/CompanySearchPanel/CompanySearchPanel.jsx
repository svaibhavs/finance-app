/**
 * CompanySearchPanel
 * Allows the user to enter any ticker symbol and see a price chart
 * for that company — independent of the fixed IBM/competitors dashboards.
 *
 * States:
 *   idle    — prompt to enter a symbol
 *   loading — spinner message while fetching
 *   error   — clear message for invalid/unavailable symbols (AC-4)
 *   loaded  — quote summary + 7-day PriceLineChart (AC-5)
 */
import { useCompanySearch } from '../../hooks/useCompanySearch'
import PriceLineChart from '../PriceLineChart/PriceLineChart'
import styles from './CompanySearchPanel.module.css'

function QuoteSummary({ quote }) {
  const positive = quote.change >= 0
  return (
    <div className={styles.quoteSummary}>
      <span className={styles.quoteName}>{quote.name ?? quote.ticker}</span>
      <span className={styles.quotePrice}>${Number(quote.price).toFixed(2)}</span>
      <span className={`${styles.quoteChange} ${positive ? styles.pos : styles.neg}`}>
        {positive ? '+' : ''}{Number(quote.change).toFixed(2)}&nbsp;
        ({positive ? '+' : ''}{Number(quote.changePercent).toFixed(2)}%)
      </span>
    </div>
  )
}

function CompanySearchPanel() {
  const {
    inputValue,
    setInputValue,
    handleSubmit,
    status,
    ticker,
    quote,
    history,
    error,
  } = useCompanySearch()

  function onKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Company Lookup</h2>
      <p className={styles.subtitle}>
        Enter any ticker symbol to load its current quote and 7-day price chart.
      </p>

      {/* ── Search bar ── */}
      <div className={styles.searchRow}>
        <input
          className={styles.input}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="e.g. AAPL, NVDA, TSLA"
          aria-label="Ticker symbol"
          maxLength={10}
          spellCheck={false}
        />
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={status === 'loading' || !inputValue.trim()}
        >
          Search
        </button>
      </div>

      {/* ── State panels ── */}
      {status === 'idle' && (
        <p className={styles.hint}>Enter a ticker symbol above to load a company graph.</p>
      )}

      {status === 'loading' && (
        <p className={styles.loading}>Loading {ticker}…</p>
      )}

      {status === 'error' && (
        <p className={styles.error} role="alert">⚠ {error}</p>
      )}

      {status === 'loaded' && quote && (
        <div className={styles.result}>
          <QuoteSummary quote={quote} />
          <div className={styles.chartWrap}>
            <h3 className={styles.chartTitle}>{ticker} — Last 7 Days</h3>
            <PriceLineChart series={history} color="#0ea5e9" height={260} />
          </div>
        </div>
      )}
    </section>
  )
}

export default CompanySearchPanel
