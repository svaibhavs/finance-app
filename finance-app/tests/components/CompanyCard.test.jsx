import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CompanyCard from '../../src/components/CompanyCard/CompanyCard'

// Mock the useQuote hook so CompanyCard is testable in isolation
vi.mock('../../src/hooks/useQuote', () => ({
  useQuote: vi.fn(),
}))

import { useQuote } from '../../src/hooks/useQuote'

describe('CompanyCard', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders loading state', () => {
    useQuote.mockReturnValue({ quote: null, loading: true, error: null })
    render(<CompanyCard ticker="IBM" name="IBM" />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('renders error state', () => {
    useQuote.mockReturnValue({ quote: null, loading: false, error: 'Network error' })
    render(<CompanyCard ticker="IBM" name="IBM" />)
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('renders price and positive change', () => {
    useQuote.mockReturnValue({
      quote: {
        ticker: 'IBM', name: 'IBM', price: 182.45, change: 1.23, changePercent: 0.68,
        previousClose: 181.22, open: 181.50, dayHigh: 183.10, dayLow: 180.95,
        volume: 4_230_000, avgVolume: 4_800_000, marketCap: 167_000_000_000,
        week52High: 199.18, week52Low: 135.87, currency: 'USD',
        exchange: 'NYSE', marketState: 'CLOSED',
      },
      loading: false,
      error: null,
    })
    render(<CompanyCard ticker="IBM" name="IBM" />)
    expect(screen.getByText('$182.45')).toBeInTheDocument()
    expect(screen.getByText('+1.23 (+0.68%)')).toBeInTheDocument()
  })

  it('renders negative change without extra plus sign', () => {
    useQuote.mockReturnValue({
      quote: {
        ticker: 'MSFT', name: 'Microsoft', price: 415.32, change: -2.10, changePercent: -0.50,
        previousClose: 417.42, open: 417.00, dayHigh: 418.55, dayLow: 414.10,
        volume: 18_500_000, avgVolume: 21_000_000, marketCap: 3_090_000_000_000,
        week52High: 468.35, week52Low: 309.45, currency: 'USD',
        exchange: 'NASDAQ', marketState: 'CLOSED',
      },
      loading: false,
      error: null,
    })
    render(<CompanyCard ticker="MSFT" name="Microsoft" />)
    expect(screen.getByText('-2.10 (-0.50%)')).toBeInTheDocument()
  })

  it('shows "Market Open" badge when marketState is REGULAR', () => {
    useQuote.mockReturnValue({
      quote: {
        ticker: 'IBM', name: 'IBM', price: 182.45, change: 1.23, changePercent: 0.68,
        previousClose: 181.22, open: 181.50, dayHigh: 183.10, dayLow: 180.95,
        volume: 4_230_000, avgVolume: 4_800_000, marketCap: 167_000_000_000,
        week52High: 199.18, week52Low: 135.87, currency: 'USD',
        exchange: 'NYSE', marketState: 'REGULAR',
      },
      loading: false,
      error: null,
    })
    render(<CompanyCard ticker="IBM" name="IBM" />)
    expect(screen.getByText('Market Open')).toBeInTheDocument()
  })

  it('shows "Closed" badge when marketState is CLOSED', () => {
    useQuote.mockReturnValue({
      quote: {
        ticker: 'IBM', name: 'IBM', price: 182.45, change: 1.23, changePercent: 0.68,
        previousClose: 181.22, open: 181.50, dayHigh: 183.10, dayLow: 180.95,
        volume: 4_230_000, avgVolume: 4_800_000, marketCap: 167_000_000_000,
        week52High: 199.18, week52Low: 135.87, currency: 'USD',
        exchange: 'NYSE', marketState: 'CLOSED',
      },
      loading: false,
      error: null,
    })
    render(<CompanyCard ticker="IBM" name="IBM" />)
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('hides OHLC details in compact mode', () => {
    useQuote.mockReturnValue({
      quote: {
        ticker: 'IBM', name: 'IBM', price: 182.45, change: 1.23, changePercent: 0.68,
        previousClose: 181.22, open: 181.50, dayHigh: 183.10, dayLow: 180.95,
        volume: 4_230_000, avgVolume: 4_800_000, marketCap: 167_000_000_000,
        week52High: 199.18, week52Low: 135.87, currency: 'USD',
        exchange: 'NYSE', marketState: 'CLOSED',
      },
      loading: false,
      error: null,
    })
    render(<CompanyCard ticker="IBM" name="IBM" compact />)
    // In compact mode the OHLC meta grid is not rendered
    expect(screen.queryByText('Open')).not.toBeInTheDocument()
    expect(screen.queryByText('52-Week Range')).not.toBeInTheDocument()
    // But price and change are still shown
    expect(screen.getByText('$182.45')).toBeInTheDocument()
  })
})
