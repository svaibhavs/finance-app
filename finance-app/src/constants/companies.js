/**
 * companies.js
 * Master list of tracked companies and dashboard configuration constants.
 *
 * To add a new company:
 *   1. Add an entry to COMPANIES (ticker + name + sector + description)
 *   2. Add matching entries to MOCK_QUOTES and MOCK_HISTORIES in services/mockData.js
 *   No other files need to change.
 */

// ── Company registry ──────────────────────────────────────────────────────

export const COMPANIES = [
  {
    ticker:      'IBM',
    name:        'IBM',
    fullName:    'International Business Machines',
    sector:      'Technology',
    description: 'Hybrid cloud, AI, and consulting services',
  },
  {
    ticker:      'MSFT',
    name:        'Microsoft',
    fullName:    'Microsoft Corporation',
    sector:      'Technology',
    description: 'Cloud (Azure), productivity software, and enterprise services',
  },
  {
    ticker:      'ORCL',
    name:        'Oracle',
    fullName:    'Oracle Corporation',
    sector:      'Technology',
    description: 'Database software, cloud infrastructure, and ERP',
  },
  {
    ticker:      'SAP',
    name:        'SAP',
    fullName:    'SAP SE',
    sector:      'Technology',
    description: 'Enterprise resource planning and business applications',
  },
  {
    ticker:      'CRM',
    name:        'Salesforce',
    fullName:    'Salesforce Inc.',
    sector:      'Technology',
    description: 'Customer relationship management and cloud applications',
  },
]

/** Convenience map for O(1) lookup by ticker: COMPANY_MAP['IBM'] → company object */
export const COMPANY_MAP = Object.fromEntries(
  COMPANIES.map((c) => [c.ticker, c])
)

// ── Time windows ──────────────────────────────────────────────────────────

export const TIME_WINDOWS = {
  DAY:     'day',
  WEEK:    '7d',
  QUARTER: 'quarter',
}

export const TIME_WINDOW_LABELS = {
  [TIME_WINDOWS.DAY]:     'Current Day',
  [TIME_WINDOWS.WEEK]:    'Last 7 Days',
  [TIME_WINDOWS.QUARTER]: 'Last Quarter',
}

// ── Chart colours — one per company, in COMPANIES order ───────────────────
export const COMPANY_COLORS = ['#1d4ed8', '#7c3aed', '#b45309', '#0f766e', '#be185d']
