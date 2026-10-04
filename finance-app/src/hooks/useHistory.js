/**
 * useHistory.js
 * Fetches and caches historical price series for a ticker + time window.
 * Returns { series, loading, error }.
 */
import { useEffect, useState } from 'react'
import useDashboardStore from '../state/dashboardStore'
import { getHistory } from '../services/financeService'

export function useHistory(ticker, window) {
  const series = useDashboardStore((s) => s.histories[ticker]?.[window])
  const setHistory = useDashboardStore((s) => s.setHistory)
  const [loading, setLoading] = useState(!series)

  useEffect(() => {
    if (series) return // already cached
    if (window === 'day') {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    getHistory(ticker, window).then((data) => {
      if (!cancelled) {
        setHistory(ticker, window, data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [ticker, window, series, setHistory])

  return {
    series:  series && !series.error ? series : [],
    loading,
    error:   series?.error ?? null,
  }
}
