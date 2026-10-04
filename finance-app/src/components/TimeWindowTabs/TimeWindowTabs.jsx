import { TIME_WINDOWS, TIME_WINDOW_LABELS } from '../../constants/companies'
import styles from './TimeWindowTabs.module.css'

const WINDOWS = Object.values(TIME_WINDOWS)

function TimeWindowTabs({ selected, onSelect }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Time window">
      {WINDOWS.map((w) => (
        <button
          key={w}
          role="tab"
          aria-selected={selected === w}
          className={`${styles.tab} ${selected === w ? styles.active : ''}`}
          onClick={() => onSelect(w)}
        >
          {TIME_WINDOW_LABELS[w]}
        </button>
      ))}
    </div>
  )
}

export default TimeWindowTabs
