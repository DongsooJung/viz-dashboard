import { useEffect, useState } from 'react'
import Panel from './components/Panel'
import RechartsPanel from './components/RechartsPanel'
import D3ScatterPanel from './components/D3ScatterPanel'
import PlotlyHeatmapPanel from './components/PlotlyHeatmapPanel'
import { fetchJSON, type GuPrices } from './lib/seoulData'
import './App.css'

interface Kpi { label: string; value: string; delta: string; up: boolean }

function App() {
  const [kpis, setKpis] = useState<Kpi[]>([])

  useEffect(() => {
    fetchJSON<GuPrices>('gu_prices.json')
      .then((d) => {
        const rows = Object.values(d.districts)
        const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length
        const avgPrice = Math.round(mean(rows.map((r) => r.price)))
        const totalVol = rows.reduce((s, r) => s + r.vol, 0)
        const avgYoy = mean(rows.map((r) => r.yoy))
        setKpis([
          { label: '평균 평단가', value: `${avgPrice.toLocaleString()}만원`, delta: '만원/평', up: true },
          { label: '2026 거래량', value: totalVol.toLocaleString(), delta: '건', up: true },
          { label: '평균 변동률', value: `${avgYoy > 0 ? '+' : ''}${avgYoy.toFixed(1)}%`, delta: 'YoY', up: avgYoy >= 0 },
          { label: '자치구', value: `${rows.length}`, delta: '개구', up: true },
        ])
      })
      .catch(() => setKpis([]))
  }, [])

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">서울 부동산 실거래 대시보드</h1>
          <p className="app__desc">서울 열린데이터광장 아파트 실거래 · Recharts · D3 · Plotly</p>
        </div>
        <span className="app__stamp">Stargate · viz-dashboard</span>
      </header>

      <div className="kpis">
        {kpis.length
          ? kpis.map((k) => (
              <div className="kpi" key={k.label}>
                <span className="kpi__label">{k.label}</span>
                <span className="kpi__value">{k.value}</span>
                <span className={`kpi__delta ${k.up ? 'up' : 'down'}`}>{k.delta}</span>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div className="kpi" key={i}>
                <span className="kpi__label">불러오는 중…</span>
                <span className="kpi__value">—</span>
              </div>
            ))}
      </div>

      <main className="grid">
        <div className="grid__wide">
          <Panel title="서울 월별 아파트 거래" subtitle="거래량(막대) + 평단가 중앙값(영역)" badge="Recharts">
            <RechartsPanel />
          </Panel>
        </div>
        <Panel title="평단가 vs 전년 변동률" subtitle="자치구별 · OLS 회귀선" badge="D3">
          <D3ScatterPanel />
        </Panel>
        <Panel title="자치구 × 월 거래량" subtitle="거래량 상위 8개구 · 최근 6개월" badge="Plotly">
          <PlotlyHeatmapPanel />
        </Panel>
      </main>

      <footer className="app__footer">
        데이터 출처: 서울 열린데이터광장 아파트 실거래 · 월간 자동 갱신 · <code>stargate-visual/assets</code>
      </footer>
    </div>
  )
}

export default App
