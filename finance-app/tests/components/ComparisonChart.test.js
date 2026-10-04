import { describe, it, expect } from 'vitest'
import { mergeSeriesMap } from '../../src/utils/chartUtils'

const companies = [
  { ticker: 'IBM' },
  { ticker: 'MSFT' },
]

const seriesMap = {
  IBM:  [
    { date: '2024-03-01', close: 180 },
    { date: '2024-03-02', close: 182 },
    { date: '2024-03-03', close: 181 },
  ],
  MSFT: [
    { date: '2024-03-01', close: 415 },
    { date: '2024-03-02', close: 418 },
    { date: '2024-03-03', close: 420 },
  ],
}

describe('mergeSeriesMap', () => {
  it('returns one row per unique date sorted ascending', () => {
    const merged = mergeSeriesMap(companies, seriesMap)
    expect(merged).toHaveLength(3)
    expect(merged[0].date).toBe('2024-03-01')
    expect(merged[2].date).toBe('2024-03-03')
  })

  it('maps close values to ticker-keyed columns', () => {
    const merged = mergeSeriesMap(companies, seriesMap)
    expect(merged[0].IBM).toBe(180)
    expect(merged[0].MSFT).toBe(415)
    expect(merged[1].IBM).toBe(182)
    expect(merged[1].MSFT).toBe(418)
  })

  it('fills null for dates missing from one company', () => {
    const sparse = {
      IBM:  [{ date: '2024-03-01', close: 180 }],
      MSFT: [
        { date: '2024-03-01', close: 415 },
        { date: '2024-03-02', close: 418 },
      ],
    }
    const merged = mergeSeriesMap(companies, sparse)
    expect(merged).toHaveLength(2)
    const march2 = merged.find((r) => r.date === '2024-03-02')
    expect(march2.MSFT).toBe(418)
    expect(march2.IBM).toBeNull()
  })

  it('returns empty array when seriesMap is empty', () => {
    expect(mergeSeriesMap(companies, {})).toEqual([])
  })

  it('returns empty array when companies is empty', () => {
    expect(mergeSeriesMap([], seriesMap)).toEqual([])
  })
})
