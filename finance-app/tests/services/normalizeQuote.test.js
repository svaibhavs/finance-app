import { describe, it, expect } from 'vitest'
import { normalizeQuote } from '../../src/utils/normalizeQuote'

describe('normalizeQuote', () => {
  it('maps all core fields from a full yahoo-finance2 quote', () => {
    const raw = {
      symbol: 'IBM',
      shortName: 'International Business Machines',
      regularMarketPrice: 182.45,
      regularMarketChange: 1.23,
      regularMarketChangePercent: 0.68,
      regularMarketPreviousClose: 181.22,
      regularMarketOpen: 181.50,
      regularMarketDayHigh: 183.10,
      regularMarketDayLow: 180.95,
      regularMarketVolume: 4_230_000,
      averageDailyVolume3Month: 4_800_000,
      marketCap: 167_000_000_000,
      fiftyTwoWeekHigh: 199.18,
      fiftyTwoWeekLow: 135.87,
      currency: 'USD',
      fullExchangeName: 'New York Stock Exchange',
      marketState: 'CLOSED',
    }
    const result = normalizeQuote(raw)
    expect(result.ticker).toBe('IBM')
    expect(result.name).toBe('International Business Machines')
    expect(result.price).toBe(182.45)
    expect(result.change).toBe(1.23)
    expect(result.changePercent).toBe(0.68)
    expect(result.previousClose).toBe(181.22)
    expect(result.open).toBe(181.50)
    expect(result.dayHigh).toBe(183.10)
    expect(result.dayLow).toBe(180.95)
    expect(result.volume).toBe(4_230_000)
    expect(result.marketCap).toBe(167_000_000_000)
    expect(result.week52High).toBe(199.18)
    expect(result.week52Low).toBe(135.87)
    expect(result.currency).toBe('USD')
    expect(result.marketState).toBe('CLOSED')
  })

  it('falls back to longName when shortName is absent', () => {
    const raw = { symbol: 'XYZ', longName: 'XYZ Corp', regularMarketPrice: 10 }
    expect(normalizeQuote(raw).name).toBe('XYZ Corp')
  })

  it('falls back to symbol when both name fields are absent', () => {
    const raw = { symbol: 'XYZ' }
    expect(normalizeQuote(raw).name).toBe('XYZ')
  })

  it('defaults all numeric fields to 0 when absent', () => {
    const result = normalizeQuote({ symbol: 'TEST' })
    expect(result.price).toBe(0)
    expect(result.change).toBe(0)
    expect(result.volume).toBe(0)
    expect(result.marketCap).toBe(0)
    expect(result.week52High).toBe(0)
  })

  it('returns an error shape for null input', () => {
    expect(normalizeQuote(null)).toHaveProperty('error')
    expect(normalizeQuote(undefined)).toHaveProperty('error')
  })
})
