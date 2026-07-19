import { useEffect, useState } from 'react'
import Plot from '../lib/plotly'
import { fetchJSON, type GuHeatmap } from '../lib/seoulData'

// Plotly: 자치구(거래량 상위 8) × 최근 6개월 아파트 거래량 히트맵 — 실거래
export default function PlotlyHeatmapPanel() {
  const [hm, setHm] = useState<GuHeatmap | null>(null)
  useEffect(() => {
    fetchJSON<GuHeatmap>('gu_heatmap.json').then(setHm).catch(() => setHm(null))
  }, [])

  if (!hm) return <div className="loading">실거래 데이터 불러오는 중…</div>

  return (
    <Plot
      data={[
        {
          type: 'heatmap',
          x: hm.months,
          y: hm.districts,
          z: hm.z,
          colorscale: [
            [0, '#0f2018'],
            [0.5, '#1f8f5f'],
            [1, '#63d6a0'],
          ],
          hovertemplate: '%{y} · %{x}<br>거래 %{z}건<extra></extra>',
          colorbar: { title: { text: '건', side: 'right' }, tickfont: { color: '#8b949e' }, outlinewidth: 0 },
        },
      ]}
      layout={{
        autosize: true,
        height: 300,
        margin: { l: 56, r: 12, t: 10, b: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#8b949e', size: 12 },
        xaxis: { fixedrange: true },
        yaxis: { fixedrange: true, autorange: 'reversed' },
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '300px' }}
      useResizeHandler
    />
  )
}
