import { describe, it, expect } from 'vitest'
import { fmt, fmtVol, fmtCap, fmtPct } from '../../src/utils/formatters'

describe('fmt', () => {
  it('formats to 2 decimal places', () => {
    expect(fmt(182.4)).toBe('182.40')
    expect(fmt(182.456)).toBe('182.46')
    expect(fmt(0)).toBe('0.00')
  })

  it('handles string numbers', () => {
    expect(fmt('100')).toBe('100.00')
  })
})

describe('fmtVol', () => {
  it('formats millions with one decimal and M suffix', () => {
    expect(fmtVol(4_230_000)).toBe('4.2M')
    expect(fmtVol(1_000_000)).toBe('1.0M')
    expect(fmtVol(18_500_000)).toBe('18.5M')
  })

  it('formats thousands with no decimal and K suffix', () => {
    expect(fmtVol(850_000)).toBe('850K')
    expect(fmtVol(1_000)).toBe('1K')
  })

  it('formats small numbers as plain strings', () => {
    expect(fmtVol(500)).toBe('500')
    expect(fmtVol(0)).toBe('0')
  })
})

describe('fmtCap', () => {
  it('formats trillions with T suffix', () => {
    expect(fmtCap(3_090_000_000_000)).toBe('$3.09T')
    expect(fmtCap(1_000_000_000_000)).toBe('$1.00T')
  })

  it('formats billions with B suffix', () => {
    expect(fmtCap(167_000_000_000)).toBe('$167.0B')
    expect(fmtCap(1_000_000_000)).toBe('$1.0B')
  })

  it('formats millions with M suffix', () => {
    expect(fmtCap(500_000_000)).toBe('$500M')
    expect(fmtCap(1_000_000)).toBe('$1M')
  })
})

describe('fmtPct', () => {
  it('prefixes positive values with +', () => {
    expect(fmtPct(0.68)).toBe('+0.68%')
    expect(fmtPct(1.23)).toBe('+1.23%')
  })

  it('does not double-prefix negative values', () => {
    expect(fmtPct(-0.50)).toBe('-0.50%')
    expect(fmtPct(-2.10)).toBe('-2.10%')
  })

  it('treats zero as positive', () => {
    expect(fmtPct(0)).toBe('+0.00%')
  })
})
