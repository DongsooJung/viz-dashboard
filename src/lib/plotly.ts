// Plotly를 경량 dist 번들(plotly.js-dist-min)과 연결한다.
// react-plotly.js 기본 import는 무거운 plotly.js 전체를 끌어오므로,
// factory 패턴으로 dist-min만 주입해 번들 크기를 줄인다.
// @ts-expect-error - plotly.js-dist-min 에는 타입 선언이 없다.
import Plotly from 'plotly.js-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'

const Plot = createPlotlyComponent(Plotly)

export default Plot
