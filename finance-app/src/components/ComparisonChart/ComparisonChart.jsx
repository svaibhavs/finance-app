/**
 * ComparisonChart
 * Multi-company overlay line chart. Receives pre-fetched series from DashboardPage.
 *
 * Props:
 *   companies : [{ ticker, name }]
 *   seriesMap : { [ticker]: HistoryPoint[] }
 *   colors    : string[]
 *   window    : '7d' | 'quarter'
 *   height    : number (default 300)
 */
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { mergeSeriesMap } from '../../utils/chartUtils'

function ComparisonChart({ companies = [], seriesMap = {}, colors = [], height = 300 }) {
  const merged = mergeSeriesMap(companies, seriesMap)

  if (merged.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#57606a', fontSize: 13 }}>
        No data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={merged} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#57606a' }}
          tickFormatter={(d) => d.slice(5)}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#57606a' }}
          tickFormatter={(v) => `$${v}`}
          domain={['auto', 'auto']}
          width={55}
        />
        <Tooltip
          formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
          labelStyle={{ fontSize: 12 }}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {companies.map(({ ticker }, i) => (
          <Line
            key={ticker}
            type="monotone"
            dataKey={ticker}
            stroke={colors[i] ?? '#1d4ed8'}
            strokeWidth={2}
            dot={false}
            connectNulls
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ComparisonChart
