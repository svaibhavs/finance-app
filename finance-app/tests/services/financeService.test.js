/**
 * financeService.test.js
 * Tests the public financeService API against mock data.
 * VITE_USE_MOCK is forced true via vi.stubEnv so no real network calls are made.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Force mock mode before importing the service
vi.stubEnv('VITE_USE_MOCK', 'true')

// Dynamically import after env stub so the module sees the env value
const { getQuote, getQuotes, getHistory, getSummary } =
  await import('../../src/services/financeService')

describe('financeService (mock mode)', () => {
  describe('getQuote', () => {
    it('returns a full QuoteShape for a known ticker', async () => {
      const result = await getQuote('IBM')
      expect(result.ticker).toBe('IBM')
      expect(result.price).toBeGreaterThan(0)
      expect(result).toHaveProperty('marketCap')
      expect(result).toHaveProperty('week52High')
      expect(result).toHaveProperty('previousClose')
      expect(result).not.toHaveProperty('error')
    })

    it('is case-insensitive', async () => {
      const lower = await getQuote('ibm')
      const upper = await getQuote('IBM')
      expect(lower.ticker).toBe(upper.ticker)
    })

    it('returns an error shape for an unknown ticker', async () => {
      const result = await getQuote('UNKNOWN')
      expect(result).toHaveProperty('error')
    })
  })

  describe('getQuotes', () => {
    it('returns a map keyed by ticker for multiple tickers', async () => {
      const result = await getQuotes(['IBM', 'MSFT', 'ORCL'])
      expect(Object.keys(result)).toEqual(expect.arrayContaining(['IBM', 'MSFT', 'ORCL']))
      expect(result.IBM.price).toBeGreaterThan(0)
      expect(result.MSFT.price).toBeGreaterThan(0)
    })

    it('marks only the failing ticker as an error, not the whole batch', async () => {
      const result = await getQuotes(['IBM', 'BADTICKER'])
      expect(result.IBM).not.toHaveProperty('error')
      expect(result.BADTICKER).toHaveProperty('error')
    })
  })

  describe('getHistory', () => {
    it('returns an empty array for the day window', async () => {
      const result = await getHistory('IBM', 'day')
      expect(result).toEqual([])
    })

    it('returns a non-empty OHLCV array for 7d', async () => {
      const result = await getHistory('IBM', '7d')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('date')
      expect(result[0]).toHaveProperty('open')
      expect(result[0]).toHaveProperty('high')
      expect(result[0]).toHaveProperty('low')
      expect(result[0]).toHaveProperty('close')
      expect(result[0]).toHaveProperty('volume')
    })

    it('returns sorted ascending dates for the quarter window', async () => {
      const result = await getHistory('IBM', 'quarter')
      expect(result.length).toBeGreaterThan(0)
      const dates = result.map((p) => p.date)
      expect(dates).toEqual([...dates].sort())
    })

    it('returns an error shape for an unknown ticker', async () => {
      const result = await getHistory('BADTICKER', '7d')
      expect(result).toHaveProperty('error')
    })
  })

  describe('getSummary', () => {
    it('returns quote + weekHistory + quarterHistory in one call', async () => {
      const result = await getSummary('MSFT')
      expect(result.quote.ticker).toBe('MSFT')
      expect(Array.isArray(result.weekHistory)).toBe(true)
      expect(Array.isArray(result.quarterHistory)).toBe(true)
      expect(result.weekHistory.length).toBeGreaterThan(0)
      expect(result.quarterHistory.length).toBeGreaterThan(result.weekHistory.length)
    })
  })
})
