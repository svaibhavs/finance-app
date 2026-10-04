/**
 * DaySummaryView
 * Current Day tab: full-detail CompanyCards for all tracked companies.
 * Shows price, change, OHLC, volume, market cap, and 52-week range.
 */
import CompanyCard from '../CompanyCard/CompanyCard'
import { COMPANIES } from '../../constants/companies'
import styles from './DaySummaryView.module.css'

function DaySummaryView() {
  return (
    <div className={styles.view}>
      <div className={styles.intro}>
        <p className={styles.introText}>
          Live market summary for IBM and its major competitors.
          Prices update on page load. Set <code>VITE_USE_MOCK=false</code> to connect to live Yahoo Finance data.
        </p>
      </div>

      <div className={styles.grid}>
        {COMPANIES.map(({ ticker, name }) => (
          <CompanyCard key={ticker} ticker={ticker} name={name} />
        ))}
      </div>
    </div>
  )
}

export default DaySummaryView
