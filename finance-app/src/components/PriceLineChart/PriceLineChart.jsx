/**
 * PriceLineChart
 * Dumb presentational chart — renders a single company's price series.
 * Knows nothing about tickers, windows, or data fetching.
 *
 * Props:
 *   series : [{ date: string, close: number }]
 *   color  : string  (hex colour for the line)
 *   height : number  (default 200)
 */
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

function PriceLineChart({ series = [], color = '#1d4ed8', height = 200 }) {
  if (series.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#57606a', fontSize: 13 }}>No data</div>
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#57606a' }}
          tickFormatter={(d) => d.slice(5)} // show MM-DD
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#57606a' }}
          tickFormatter={(v) => `$${v}`}
          domain={['auto', 'auto']}
          width={55}
        />
        <Tooltip
          formatter={(value) => [`$${value.toFixed(2)}`, 'Close']}
          labelStyle={{ fontSize: 12 }}
          contentStyle={{ fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default PriceLineChart
