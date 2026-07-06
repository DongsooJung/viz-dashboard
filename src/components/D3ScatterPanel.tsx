import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { scatterData } from '../data/sample'

// D3: 접근성 vs 평단가 산점도 + OLS 회귀선 (헤도닉 관계 시각화)
// D3의 강점(축·스케일·직접 SVG 제어)을 보여주는 예시.
export default function D3ScatterPanel() {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const width = 560
    const height = 300
    const margin = { top: 16, right: 20, bottom: 40, left: 52 }
    const iw = width - margin.left - margin.right
    const ih = height - margin.top - margin.bottom

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleLinear()
      .domain(d3.extent(scatterData, (d) => d.accessibility) as [number, number])
      .nice()
      .range([0, iw])
    const y = d3
      .scaleLinear()
      .domain(d3.extent(scatterData, (d) => d.price) as [number, number])
      .nice()
      .range([ih, 0])

    // 격자 + 축
    g.append('g')
      .attr('transform', `translate(0,${ih})`)
      .call(d3.axisBottom(x).ticks(6).tickSize(-ih))
      .call((sel) => sel.select('.domain').remove())
      .selectAll('line')
      .attr('stroke', '#21262d')
    g.append('g')
      .call(d3.axisLeft(y).ticks(6).tickSize(-iw))
      .call((sel) => sel.select('.domain').remove())
      .selectAll('line')
      .attr('stroke', '#21262d')
    g.selectAll('text').attr('fill', '#8b949e').attr('font-size', 11)

    // 축 라벨
    g.append('text')
      .attr('x', iw / 2)
      .attr('y', ih + 34)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8b949e')
      .attr('font-size', 12)
      .text('교통 접근성 지표')
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -ih / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8b949e')
      .attr('font-size', 12)
      .text('평단가 (만원)')

    // OLS 회귀선 계산
    const n = scatterData.length
    const sx = d3.sum(scatterData, (d) => d.accessibility)
    const sy = d3.sum(scatterData, (d) => d.price)
    const sxy = d3.sum(scatterData, (d) => d.accessibility * d.price)
    const sxx = d3.sum(scatterData, (d) => d.accessibility * d.accessibility)
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx)
    const intercept = (sy - slope * sx) / n
    const xd = x.domain()

    g.append('line')
      .attr('x1', x(xd[0]))
      .attr('y1', y(intercept + slope * xd[0]))
      .attr('x2', x(xd[1]))
      .attr('y2', y(intercept + slope * xd[1]))
      .attr('stroke', '#f778ba')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 4')

    // 데이터 포인트 (진입 애니메이션)
    g.selectAll('circle')
      .data(scatterData)
      .join('circle')
      .attr('cx', (d) => x(d.accessibility))
      .attr('cy', (d) => y(d.price))
      .attr('fill', '#58a6ff')
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#0d1117')
      .attr('stroke-width', 1)
      .attr('r', 0)
      .append('title')
      .text((d) => `${d.region}\n접근성 ${d.accessibility} · ${d.price.toLocaleString()}만원`)

    g.selectAll('circle')
      .transition()
      .duration(600)
      .delay((_, i) => i * 25)
      .attr('r', 6)

    // 회귀식 주석
    g.append('text')
      .attr('x', iw - 4)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('fill', '#f778ba')
      .attr('font-size', 12)
      .text(`ŷ = ${intercept.toFixed(0)} + ${slope.toFixed(1)}·x`)
  }, [])

  return <svg ref={ref} width="100%" height={300} role="img" aria-label="접근성-가격 산점도" />
}
