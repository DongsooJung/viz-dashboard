import Panel from './components/Panel'
import RechartsPanel from './components/RechartsPanel'
import D3ScatterPanel from './components/D3ScatterPanel'
import PlotlyHeatmapPanel from './components/PlotlyHeatmapPanel'
import { kpis } from './data/sample'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">지역 분석 대시보드</h1>
          <p className="app__desc">Recharts · D3 · Plotly 통합 시각화 데모</p>
        </div>
        <span className="app__stamp">Stargate · viz-dashboard</span>
      </header>

      <div className="kpis">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <span className="kpi__label">{k.label}</span>
            <span className="kpi__value">{k.value}</span>
            <span className={`kpi__delta ${k.up ? 'up' : 'down'}`}>{k.delta}</span>
          </div>
        ))}
      </div>

      <main className="grid">
        <div className="grid__wide">
          <Panel title="월별 가격지수 · 거래량" subtitle="복합 차트 (영역 + 막대)" badge="Recharts">
            <RechartsPanel />
          </Panel>
        </div>
        <Panel title="접근성 vs 평단가" subtitle="OLS 회귀선 포함 산점도" badge="D3">
          <D3ScatterPanel />
        </Panel>
        <Panel title="자치구 × 분기 변동률" subtitle="인터랙티브 히트맵" badge="Plotly">
          <PlotlyHeatmapPanel />
        </Panel>
      </main>

      <footer className="app__footer">
        데이터는 데모용 시드 생성값입니다 · <code>src/data/sample.ts</code> 교체 시 실데이터 연동
      </footer>
    </div>
  )
}

export default App
