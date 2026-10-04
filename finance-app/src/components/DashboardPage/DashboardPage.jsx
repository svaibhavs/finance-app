/**
 * DashboardPage
 * Top-level page shell. Owns the time-window tab state and
 * routes each tab to its dedicated view component.
 *
 * View routing:
 *   day     → DaySummaryView   (current prices, OHLC, 52-week range)
 *   7d      → WeekView         (compact cards + 7-day comparison chart)
 *   quarter → QuarterView      (normalised return chart + ranking table)
 */
import TimeWindowTabs from '../TimeWindowTabs/TimeWindowTabs'
import DaySummaryView from '../DaySummaryView/DaySummaryView'
import WeekView       from '../WeekView/WeekView'
import QuarterView    from '../QuarterView/QuarterView'
import useDashboardStore from '../../state/dashboardStore'
import { TIME_WINDOWS } from '../../constants/companies'
import styles from './DashboardPage.module.css'

function DashboardPage() {
  const selectedWindow = useDashboardStore((s) => s.selectedWindow)
  const setWindow      = useDashboardStore((s) => s.setWindow)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.title}>Finance Dashboard</h1>
            <p className={styles.subtitle}>IBM &amp; Competitors — Market Overview</p>
          </div>
          <div className={styles.tabsWrap}>
            <TimeWindowTabs selected={selectedWindow} onSelect={setWindow} />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {selectedWindow === TIME_WINDOWS.DAY     && <DaySummaryView />}
        {selectedWindow === TIME_WINDOWS.WEEK    && <WeekView />}
        {selectedWindow === TIME_WINDOWS.QUARTER && <QuarterView />}
      </main>
    </div>
  )
}

export default DashboardPage
