import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CompanySearchPanel from '../../src/components/CompanySearchPanel/CompanySearchPanel'

// ── Mock the finance service so tests are deterministic ───────────────────
vi.mock('../../src/services/financeService', () => ({
  getQuote:   vi.fn(),
  getHistory: vi.fn(),
}))

import { getQuote, getHistory } from '../../src/services/financeService'

const MOCK_QUOTE = {
  ticker: 'AAPL', name: 'Apple Inc.',
  price: 210.50, change: 1.75, changePercent: 0.84,
  previousClose: 208.75, open: 209.00, dayHigh: 211.20, dayLow: 208.50,
  volume: 55_000_000, avgVolume: 60_000_000,
  marketCap: 3_200_000_000_000,
  week52High: 237.23, week52Low: 164.08,
  currency: 'USD', exchange: 'NASDAQ', marketState: 'CLOSED',
}

const MOCK_HISTORY = [
  { date: '2024-01-02', open: 185.0, high: 186.0, low: 184.5, close: 185.5, volume: 50_000_000 },
  { date: '2024-01-03', open: 185.5, high: 187.0, low: 185.0, close: 186.8, volume: 52_000_000 },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CompanySearchPanel', () => {
  // AC-1: idle state renders input and button
  it('renders input and search button in idle state', () => {
    render(<CompanySearchPanel />)
    expect(screen.getByRole('textbox', { name: /ticker symbol/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    expect(screen.getByText(/enter a ticker symbol above/i)).toBeInTheDocument()
  })

  // AC-2: empty input keeps button disabled
  it('disables the search button when input is empty', () => {
    render(<CompanySearchPanel />)
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()
  })

  // AC-2: whitespace-only input keeps button disabled
  it('disables the search button when input is only whitespace', () => {
    render(<CompanySearchPanel />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } })
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()
  })

  // AC-3: loading state shown while fetching
  it('shows loading state while fetch is in progress', async () => {
    // Never resolves during this test — keeps component in loading state
    getQuote.mockReturnValue(new Promise(() => {}))
    getHistory.mockReturnValue(new Promise(() => {}))

    render(<CompanySearchPanel />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'AAPL' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() =>
      expect(screen.getByText(/loading aapl/i)).toBeInTheDocument()
    )
  })

  // AC-4: error state for unknown ticker
  it('shows error message when ticker is unknown', async () => {
    getQuote.mockResolvedValue({ error: 'Unknown symbol: XYZ' })
    getHistory.mockResolvedValue([])

    render(<CompanySearchPanel />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'xyz' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('Unknown symbol: XYZ')
    )
  })

  // AC-5: successful load renders quote and chart
  it('renders quote summary and chart after successful search', async () => {
    getQuote.mockResolvedValue(MOCK_QUOTE)
    getHistory.mockResolvedValue(MOCK_HISTORY)

    render(<CompanySearchPanel />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'AAPL' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() =>
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument()
    )
    expect(screen.getByText('$210.50')).toBeInTheDocument()
    expect(screen.getByText(/aapl — last 7 days/i)).toBeInTheDocument()
  })

  // AC-5: ticker is uppercased before submission
  it('uppercases the submitted ticker', async () => {
    getQuote.mockResolvedValue(MOCK_QUOTE)
    getHistory.mockResolvedValue(MOCK_HISTORY)

    render(<CompanySearchPanel />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'aapl' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() =>
      expect(screen.getByText(/aapl — last 7 days/i)).toBeInTheDocument()
    )
    expect(getQuote).toHaveBeenCalledWith('AAPL')
  })

  // AC-5: Enter key triggers search
  it('triggers search on Enter key press', async () => {
    getQuote.mockResolvedValue(MOCK_QUOTE)
    getHistory.mockResolvedValue(MOCK_HISTORY)

    render(<CompanySearchPanel />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'AAPL' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() =>
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument()
    )
  })

  // AC-6: panel section title always present (does not affect other views)
  it('always renders the Company Lookup section heading', () => {
    render(<CompanySearchPanel />)
    expect(screen.getByRole('heading', { name: /company lookup/i })).toBeInTheDocument()
  })

  // negative change formatting
  it('renders negative change correctly', async () => {
    getQuote.mockResolvedValue({
      ...MOCK_QUOTE,
      price: 205.30,
      change: -5.20,
      changePercent: -2.47,
    })
    getHistory.mockResolvedValue([])

    render(<CompanySearchPanel />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'AAPL' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() =>
      expect(screen.getByText('$205.30')).toBeInTheDocument()
    )
    expect(screen.getByText(/-5\.20/)).toBeInTheDocument()
  })
})
