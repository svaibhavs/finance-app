/**
 * useCompanySearch.js
 * Manages the full lifecycle for the user-selected company search panel.
 *
 * State machine:
 *   idle ──submit──▶ loading ──success──▶ loaded
 *                       └──error──▶ error
 *   loaded | error ──new submit──▶ loading  (resets)
 *
 * Returns:
 *   inputValue     : string          — controlled input value
 *   setInputValue  : fn(string)      — update input
 *   handleSubmit   : fn()            — trigger search
 *   status         : 'idle' | 'loading' | 'loaded' | 'error'
 *   ticker         : string | null   — the last successfully submitted ticker
 *   quote          : QuoteShape | null
 *   history        : HistoryPoint[]
 *   error          : string | null
 */
import { useState, useCallback } from 'react'
import { getQuote, getHistory } from '../services/financeService'

export function useCompanySearch() {
  const [inputValue, setInputValue]   = useState('')
  const [status, setStatus]           = useState('idle')
  const [ticker, setTicker]           = useState(null)
  const [quote, setQuote]             = useState(null)
  const [history, setHistory]         = useState([])
  const [error, setError]             = useState(null)

  const handleSubmit = useCallback(async () => {
    const symbol = inputValue.trim().toUpperCase()
    if (!symbol) return

    setStatus('loading')
    setTicker(symbol)
    setQuote(null)
    setHistory([])
    setError(null)

    const [quoteResult, historyResult] = await Promise.all([
      getQuote(symbol),
      getHistory(symbol, '7d'),
    ])

    if (quoteResult.error) {
      setError(quoteResult.error)
      setStatus('error')
      return
    }

    setQuote(quoteResult)
    setHistory(Array.isArray(historyResult) ? historyResult : [])
    setStatus('loaded')
  }, [inputValue])

  return {
    inputValue,
    setInputValue,
    handleSubmit,
    status,
    ticker,
    quote,
    history,
    error,
  }
}
