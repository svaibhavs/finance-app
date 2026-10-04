/**
 * views.test.jsx
 * Render-path tests for all three dashboard view components.
 * useQuote and useHistory are mocked so no Zustand store or network is needed.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ── Shared mock data ───────────────────────────────────────────────────────

const fullQuote = (ticker) => ({
  ticker, name: ticker, price: 100, change: 1, changePercent: 1,
  previousClose: 99, open: 99.5, dayHigh: 101, dayLow: 98.5,
  volume: 1_000_000, avgVolume: 1_200_000, marketCap: 10_000_000_000,
  week52High: 120, week52Low: 80, currency: 'USD',
  exchange: 'NYSE', marketState: 'CLOSED',
})

const weekSeries = [
  { date: '2024-03-01', open: 99, high: 101, low: 98, close: 100, volume: 1_000_000 },
  { date: '2024-03-02', open: 100, high: 102, low: 99, close: 101, volume: 1_100_000 },
  { date: '2024-03-03', open: 101, high: 103, low: 100, close: 102, volume: 1_050_000 },
]

const quarterSeries = Array.from({ length: 60 }, (_, i) => ({
  date: `2024-0${Math.floor(i / 30) + 1}-${String((i % 30) + 1).padStart(2, '0')}`,
  open: 95 + i * 0.1, high: 96 + i * 0.1, low: 94 + i * 0.1,
  close: 95.5 + i * 0.1, volume: 1_000_000,
}))

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('../../src/hooks/useQuote', () => ({
  useQuote: (ticker) => ({ quote: fullQuote(ticker), loading: false, error: null }),
}))

vi.mock('../../src/hooks/useHistory', () => ({
  useHistory: (_ticker, window) => ({
    series: window === 'quarter' ? quarterSeries : weekSeries,
    loading: false,
    error: null,
  }),
}))

// ── DaySummaryView ─────────────────────────────────────────────────────────

import DaySummaryView from '../../src/components/DaySummaryView/DaySummaryView'

describe('DaySummaryView', () => {
  it('renders a card for each tracked company', () => {
    render(<DaySummaryView />)
    // Each CompanyCard renders with data-testid="company-card-{ticker}"
    expect(screen.getByTestId('company-card-IBM')).toBeInTheDocument()
    expect(screen.getByTestId('company-card-MSFT')).toBeInTheDocument()
    expect(screen.getByTestId('company-card-ORCL')).toBeInTheDocument()
    expect(screen.getByTestId('company-card-SAP')).toBeInTheDocument()
    expect(screen.getByTestId('company-card-CRM')).toBeInTheDocument()
  })

  it('renders the intro description text', () => {
    render(<DaySummaryView />)
    expect(screen.getByText(/Live market summary/i)).toBeInTheDocument()
  })

  it('shows a price for IBM', () => {
    render(<DaySummaryView />)
    expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0)
  })
})

// ── WeekView ───────────────────────────────────────────────────────────────

import WeekView from '../../src/components/WeekView/WeekView'

describe('WeekView', () => {
  it('renders the 7-Day Performance section heading', () => {
    render(<WeekView />)
    expect(screen.getByText('7-Day Performance')).toBeInTheDocument()
  })

  it('renders the 7-Day Price Comparison heading', () => {
    render(<WeekView />)
    expect(screen.getByText('7-Day Price Comparison')).toBeInTheDocument()
  })

  it('renders compact cards for all tracked companies', () => {
    render(<WeekView />)
    expect(screen.getByTestId('company-card-IBM')).toBeInTheDocument()
    expect(screen.getByTestId('company-card-MSFT')).toBeInTheDocument()
  })
})

// ── QuarterView ────────────────────────────────────────────────────────────

import QuarterView from '../../src/components/QuarterView/QuarterView'

describe('QuarterView', () => {
  it('renders the Quarterly Return Comparison heading', () => {
    render(<QuarterView />)
    expect(screen.getByText('Quarterly Return Comparison')).toBeInTheDocument()
  })

  it('renders the Performance Ranking heading', () => {
    render(<QuarterView />)
    expect(screen.getByText('Performance Ranking')).toBeInTheDocument()
  })

  it('renders the chart note about rebasing', () => {
    render(<QuarterView />)
    expect(screen.getByText(/rebased to 0%/i)).toBeInTheDocument()
  })
})
