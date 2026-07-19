import { useEffect, useState } from 'react'
import {
  ResponsiveContainer, ComposedChart, Area, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { fetchJSON, type SeoulMonthly } from '../lib/seoulData'

interface Row { label: string; volume: number; medianPyeong: number }

// Recharts: 서울 전체 월별 아파트 거래량(막대) + 평단가 중앙값(영역) — 실거래
export default function RechartsPanel() {
  const [data, setData] = useState<Row[]>([])
  useEffect(() => {
    fetchJSON<SeoulMonthly>('seoul_monthly.json')
      .then((d) =>
        setData(
          d.series.map((r) => ({
            label: r.month.slice(2), // '2026-05' -> '26-05'
            volume: r.volume,
            medianPyeong: r.medianPyeong,
          })),
        ),
      )
      .catch(() => setData([]))
  }, [])

  if (!data.length) return <div className="loading">실거래 데이터 불러오는 중…</div>

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#58a6ff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#58a6ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
        <XAxis dataKey="label" stroke="#8b949e" fontSize={11} tickLine={false} interval={1} />
        <YAxis yAxisId="left" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis yAxisId="right" orientation="right" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, color: '#e6edf3' }}
          formatter={(value, name) => {
            const v = Number(value)
            return name === '거래량'
              ? [`${v.toLocaleString()}건`, name]
              : [`${v.toLocaleString()}만원`, name]
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8b949e' }} />
        <Bar yAxisId="right" dataKey="volume" name="거래량" fill="#3fb950" opacity={0.35} radius={[3, 3, 0, 0]} />
        <Area
          yAxisId="left" type="monotone" dataKey="medianPyeong" name="평단가(만원/평)"
          stroke="#58a6ff" strokeWidth={2} fill="url(#priceFill)" dot={{ r: 2, fill: '#58a6ff' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
