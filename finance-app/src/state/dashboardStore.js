/**
 * dashboardStore.js
 * Central Zustand store for the finance dashboard.
 *
 * State shape:
 *   selectedWindow : 'day' | '7d' | 'quarter'
 *   quotes         : { [ticker]: QuoteShape | { error } }
 *   histories      : { [ticker]: { [window]: HistoryPoint[] | { error } } }
 */
import { create } from 'zustand'
import { TIME_WINDOWS } from '../constants/companies'

const useDashboardStore = create((set) => ({
  selectedWindow: TIME_WINDOWS.DAY,

  quotes: {},
  histories: {},

  setWindow: (window) => set({ selectedWindow: window }),

  setQuote: (ticker, data) =>
    set((state) => ({
      quotes: { ...state.quotes, [ticker]: data },
    })),

  setHistory: (ticker, window, data) =>
    set((state) => ({
      histories: {
        ...state.histories,
        [ticker]: {
          ...(state.histories[ticker] ?? {}),
          [window]: data,
        },
      },
    })),
}))

export default useDashboardStore
