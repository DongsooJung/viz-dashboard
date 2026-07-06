// react-plotly.js/factory 서브패스에 대한 타입 선언
declare module 'react-plotly.js/factory' {
  import type { ComponentType } from 'react'
  import type { PlotParams } from 'react-plotly.js'
  export default function createPlotlyComponent(
    plotly: object,
  ): ComponentType<PlotParams>
}
