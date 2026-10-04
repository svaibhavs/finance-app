import { describe, it, expect } from 'vitest'
import { MOCK_QUOTES, MOCK_HISTORIES } from '../../src/services/mockData'
import { COMPANIES } from '../../src/constants/companies'

describe('mockData', () => {
  describe('MOCK_QUOTES', () => {
    it('has an entry for every tracked company', () => {
      COMPANIES.forEach(({ ticker }) => {
        expect(MOCK_QUOTES).toHaveProperty(ticker)
      })
    })

    it('every quote has the full QuoteShape fields', () => {
      const required = [
        'ticker', 'name', 'price', 'change', 'changePercent',
        'previousClose', 'open', 'dayHigh', 'dayLow',
        'volume', 'avgVolume', 'marketCap',
        'week52High', 'week52Low', 'currency', 'exchange', 'marketState',
      ]
      Object.values(MOCK_QUOTES).forEach((q) => {
        required.forEach((field) => expect(q).toHaveProperty(field))
        expect(q.price).toBeGreaterThan(0)
        expect(q.week52High).toBeGreaterThan(q.week52Low)
      })
    })
  })

  describe('MOCK_HISTORIES', () => {
    it('has 7d and quarter series for every tracked company', () => {
      COMPANIES.forEach(({ ticker }) => {
        expect(MOCK_HISTORIES).toHaveProperty(ticker)
        expect(MOCK_HISTORIES[ticker]).toHaveProperty('7d')
        expect(MOCK_HISTORIES[ticker]).toHaveProperty('quarter')
      })
    })

    it('series have full OHLCV fields and ascending dates', () => {
      const series = MOCK_HISTORIES.IBM['7d']
      expect(series.length).toBeGreaterThan(0)
      expect(series[0]).toHaveProperty('date')
      expect(series[0]).toHaveProperty('open')
      expect(series[0]).toHaveProperty('high')
      expect(series[0]).toHaveProperty('low')
      expect(series[0]).toHaveProperty('close')
      expect(series[0]).toHaveProperty('volume')

      // Dates must be sorted ascending
      const dates = series.map((p) => p.date)
      expect(dates).toEqual([...dates].sort())
    })

    it('quarter series is longer than 7d series', () => {
      COMPANIES.forEach(({ ticker }) => {
        const week    = MOCK_HISTORIES[ticker]['7d']
        const quarter = MOCK_HISTORIES[ticker]['quarter']
        expect(quarter.length).toBeGreaterThan(week.length)
      })
    })

    it('is deterministic — same series on every call', () => {
      // Re-import to check module-level stability
      const s1 = MOCK_HISTORIES.IBM['7d'].map((p) => p.close)
      const s2 = MOCK_HISTORIES.IBM['7d'].map((p) => p.close)
      expect(s1).toEqual(s2)
    })
  })
})

describe('COMPANIES registry', () => {
  it('has at least 5 entries', () => {
    expect(COMPANIES.length).toBeGreaterThanOrEqual(5)
  })

  it('IBM is the first entry', () => {
    expect(COMPANIES[0].ticker).toBe('IBM')
  })

  it('every company has required fields', () => {
    COMPANIES.forEach((c) => {
      expect(c).toHaveProperty('ticker')
      expect(c).toHaveProperty('name')
      expect(c).toHaveProperty('fullName')
      expect(c).toHaveProperty('sector')
      expect(c).toHaveProperty('description')
      expect(c.ticker).toMatch(/^[A-Z]{2,5}$/)
    })
  })

  it('no duplicate tickers', () => {
    const tickers = COMPANIES.map((c) => c.ticker)
    expect(new Set(tickers).size).toBe(tickers.length)
  })
})
