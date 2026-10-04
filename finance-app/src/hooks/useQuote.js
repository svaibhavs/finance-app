/**
 * useQuote.js
 * Fetches and caches a single company's current quote in the dashboard store.
 * Returns { quote, loading, error }.
 */
import { useEffect, useState } from 'react'
import useDashboardStore from '../state/dashboardStore'
import { getQuote } from '../services/financeService'

export function useQuote(ticker) {
  const quote = useDashboardStore((s) => s.quotes[ticker])
  const setQuote = useDashboardStore((s) => s.setQuote)
  const [loading, setLoading] = useState(!quote)

  useEffect(() => {
    if (quote) return // already cached
    let cancelled = false
    setLoading(true)
    getQuote(ticker).then((data) => {
      if (!cancelled) {
        setQuote(ticker, data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [ticker, quote, setQuote])

  return {
    quote:   quote && !quote.error ? quote : null,
    loading,
    error:   quote?.error ?? null,
  }
}
