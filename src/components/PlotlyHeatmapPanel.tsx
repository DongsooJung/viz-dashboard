import Plot from '../lib/plotly'
import { heatmapDistricts, heatmapQuarters, heatmapZ } from '../data/sample'

// Plotly: 자치구 × 분기 가격 변동률 히트맵
// Plotly의 강점(인터랙티브 hover, 컬러스케일, 줌)을 보여주는 예시.
export default function PlotlyHeatmapPanel() {
  return (
    <Plot
      data={[
        {
          type: 'heatmap',
          x: heatmapQuarters,
          y: heatmapDistricts,
          z: heatmapZ,
          colorscale: [
            [0, '#f778ba'],
            [0.5, '#161b22'],
            [1, '#3fb950'],
          ],
          zmid: 0,
          hovertemplate: '%{y} · %{x}<br>변동률 %{z}%<extra></extra>',
          colorbar: {
            title: { text: '%', side: 'right' },
            tickfont: { color: '#8b949e' },
            outlinewidth: 0,
          },
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
