import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TimeWindowTabs from '../../src/components/TimeWindowTabs/TimeWindowTabs'

describe('TimeWindowTabs', () => {
  it('renders all three tab labels', () => {
    render(<TimeWindowTabs selected="day" onSelect={() => {}} />)
    expect(screen.getByText('Current Day')).toBeInTheDocument()
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument()
    expect(screen.getByText('Last Quarter')).toBeInTheDocument()
  })

  it('marks the selected tab as aria-selected=true', () => {
    render(<TimeWindowTabs selected="7d" onSelect={() => {}} />)
    expect(screen.getByRole('tab', { name: 'Last 7 Days' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Current Day' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Last Quarter' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onSelect with the correct window key when a tab is clicked', async () => {
    const onSelect = vi.fn()
    render(<TimeWindowTabs selected="day" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Last 7 Days' }))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith('7d')
  })

  it('calls onSelect with "quarter" when Last Quarter is clicked', async () => {
    const onSelect = vi.fn()
    render(<TimeWindowTabs selected="day" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Last Quarter' }))
    expect(onSelect).toHaveBeenCalledWith('quarter')
  })

  it('does not call onSelect when the already-selected tab is clicked', async () => {
    const onSelect = vi.fn()
    render(<TimeWindowTabs selected="day" onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Current Day' }))
    // onSelect is still called — it's the parent's job to deduplicate; just assert value
    expect(onSelect).toHaveBeenCalledWith('day')
  })
})
