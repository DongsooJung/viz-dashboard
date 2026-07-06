import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { monthlyTrend } from '../data/sample'

// Recharts: 월별 가격지수(선/영역) + 거래량(막대) 복합 차트
export default function RechartsPanel() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={monthlyTrend} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#58a6ff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#58a6ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
        <XAxis dataKey="month" stroke="#8b949e" fontSize={12} tickLine={false} />
        <YAxis yAxisId="left" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#8b949e"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 8,
            color: '#e6edf3',
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8b949e' }} />
        <Bar yAxisId="right" dataKey="volume" name="거래량" fill="#3fb950" opacity={0.35} radius={[3, 3, 0, 0]} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="priceIndex"
          name="가격지수"
          stroke="#58a6ff"
          strokeWidth={2}
          fill="url(#priceFill)"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="priceIndex"
          name="가격지수(추세)"
          stroke="#58a6ff"
          strokeWidth={0}
          dot={{ r: 3, fill: '#58a6ff' }}
          legendType="none"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
