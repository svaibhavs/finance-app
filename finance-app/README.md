# Finance Dashboard — React App

A React-based finance dashboard tracking IBM and four major competitors.
Uses [Yahoo Finance](https://finance.yahoo.com/) data via a local Express proxy.

## Prerequisites

- Node.js 20+
- npm

## Quick Start (offline / mock data)

```bash
cd finance-app
npm install
npm run dev:ui        # UI only — uses VITE_USE_MOCK=true from .env.local
```

Open http://localhost:5173

## Full Start (live Yahoo Finance data)

```bash
npm install
# In one terminal:
npm run server        # starts proxy on :3001
# In another terminal:
VITE_USE_MOCK=false npm run dev:ui
```

Or run both together:
```bash
npm run dev
```

## Validation Commands

```bash
npm run lint          # ESLint
npm run test:run      # Vitest unit + component tests (CI mode)
npm run build         # Production build
```

## Project Structure

```
src/
  components/         React UI components (one folder per component)
  services/           Data layer: financeService, yahooFinanceAdapter, mockData
  hooks/              useQuote, useHistory
  state/              Zustand dashboard store
  utils/              normalizeQuote, normalizeHistory
  constants/          Company list, time windows, colours
server/
  proxy.js            Express proxy for Yahoo Finance (avoids browser CORS)
tests/
  services/           Pure function unit tests
  components/         React component render tests
```

## Companies Tracked

| Ticker | Company     |
|--------|-------------|
| IBM    | IBM         |
| MSFT   | Microsoft   |
| ORCL   | Oracle      |
| SAP    | SAP         |
| CRM    | Salesforce  |

## Time Windows

- **Current Day** — live quote summary cards
- **Last 7 Days** — multi-company comparison line chart
- **Last Quarter** — 90-day multi-company comparison line chart

## Environment Variables

| Variable        | Default | Description                                      |
|-----------------|---------|--------------------------------------------------|
| `VITE_USE_MOCK` | `true`  | Use static mock data instead of live Yahoo proxy |
