/**
 * yahooFinanceAdapter.js
 * Calls the local Express proxy (/api/finance/*) which in turn calls yahoo-finance2.
 * All other code uses financeService.js — never this module directly.
 */
import { normalizeQuote } from '../utils/normalizeQuote'
import { normalizeHistory } from '../utils/normalizeHistory'

const BASE = '/api/finance'

export async function fetchQuote(ticker) {
  const res = await fetch(`${BASE}/quote/${encodeURIComponent(ticker)}`)
  if (!res.ok) throw new Error(`Quote fetch failed for ${ticker}: ${res.status}`)
  const data = await res.json()
  return normalizeQuote(data)
}

export async function fetchHistory(ticker, window) {
  const res = await fetch(`${BASE}/history/${encodeURIComponent(ticker)}?window=${window}`)
  if (!res.ok) throw new Error(`History fetch failed for ${ticker}: ${res.status}`)
  const data = await res.json()
  return normalizeHistory(data)
}
