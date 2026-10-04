import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PriceLineChart from '../../src/components/PriceLineChart/PriceLineChart'

describe('PriceLineChart', () => {
  it('shows "No data" when series is empty', () => {
    render(<PriceLineChart series={[]} />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders without crashing when given a valid series', () => {
    const series = [
      { date: '2024-03-01', close: 180 },
      { date: '2024-03-02', close: 182 },
      { date: '2024-03-03', close: 181 },
    ]
    const { container } = render(<PriceLineChart series={series} color="#1d4ed8" height={200} />)
    // Recharts renders a ResponsiveContainer div wrapper
    expect(container.firstChild).not.toBeNull()
  })
})
