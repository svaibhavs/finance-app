import { describe, it, expect } from 'vitest'
import { normalizeHistory, normalizeHistoryForTicker } from '../../src/utils/normalizeHistory'

describe('normalizeHistory', () => {
  it('maps all OHLCV fields', () => {
    const raw = [
      { date: new Date('2024-03-01'), open: 179, high: 183, low: 178, close: 180.5, volume: 4_000_000 },
      { date: new Date('2024-03-02'), open: 180, high: 184, low: 179, close: 182.1, volume: 4_200_000 },
    ]
    const result = normalizeHistory(raw)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      date: '2024-03-01', open: 179, high: 183, low: 178, close: 180.5, volume: 4_000_000,
    })
  })

  it('returns sorted ascending by date', () => {
    const raw = [
      { date: new Date('2024-03-03'), open: 185, high: 186, low: 184, close: 185, volume: 0 },
      { date: new Date('2024-03-01'), open: 180, high: 181, low: 179, close: 180, volume: 0 },
    ]
    const result = normalizeHistory(raw)
    expect(result[0].date).toBe('2024-03-01')
    expect(result[1].date).toBe('2024-03-03')
  })

  it('filters out items with null close', () => {
    const raw = [
      { date: new Date('2024-03-01'), close: null },
      { date: new Date('2024-03-02'), open: 182, high: 183, low: 181, close: 182, volume: 0 },
    ]
    expect(normalizeHistory(raw)).toHaveLength(1)
  })

  it('handles epoch ms timestamps', () => {
    const ts = new Date('2024-03-01').getTime()
    const result = normalizeHistory([{ date: ts, close: 180, open: 0, high: 0, low: 0, volume: 0 }])
    expect(result[0].date).toBe('2024-03-01')
  })

  it('returns empty array for non-array input', () => {
    expect(normalizeHistory(null)).toEqual([])
    expect(normalizeHistory(undefined)).toEqual([])
    expect(normalizeHistory('bad')).toEqual([])
  })
})

describe('normalizeHistoryForTicker', () => {
  it('tags each point with the provided ticker', () => {
    const raw = [{ date: new Date('2024-03-01'), close: 180, open: 0, high: 0, low: 0, volume: 0 }]
    const result = normalizeHistoryForTicker(raw, 'IBM')
    expect(result[0].ticker).toBe('IBM')
    expect(result[0].close).toBe(180)
  })
})
