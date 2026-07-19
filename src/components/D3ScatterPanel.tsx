import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { fetchJSON, type GuPrices } from '../lib/seoulData'

interface Pt { ko: string; price: number; yoy: number }

// D3: 자치구별 평단가(x) vs 전년 대비 변동률(y) + OLS 회귀선 — 실거래
// "고가 지역이 더 올랐나?" 헤도닉 관계를 실데이터로 진단.
export default function D3ScatterPanel() {
  const ref = useRef<SVGSVGElement | null>(null)
  const [pts, setPts] = useState<Pt[]>([])

  useEffect(() => {
    fetchJSON<GuPrices>('gu_prices.json')
      .then((d) => setPts(Object.values(d.districts).map((r) => ({ ko: r.ko, price: r.price, yoy: r.yoy }))))
      .catch(() => setPts([]))
  }, [])

  useEffect(() => {
    if (!pts.length) return
    const width = 560, height = 300
    const margin = { top: 16, right: 20, bottom: 40, left: 52 }
    const iw = width - margin.left - margin.right, ih = height - margin.top - margin.bottom
    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain(d3.extent(pts, (d) => d.price) as [number, number]).nice().range([0, iw])
    const y = d3.scaleLinear().domain(d3.extent(pts, (d) => d.yoy) as [number, number]).nice().range([ih, 0])

    g.append('g').attr('transform', `translate(0,${ih})`)
      .call(d3.axisBottom(x).ticks(6).tickSize(-ih)).call((s) => s.select('.domain').remove())
      .selectAll('line').attr('stroke', '#21262d')
    g.append('g').call(d3.axisLeft(y).ticks(6).tickSize(-iw)).call((s) => s.select('.domain').remove())
      .selectAll('line').attr('stroke', '#21262d')
    g.selectAll('text').attr('fill', '#8b949e').attr('font-size', 11)

    // y=0 기준선
    g.append('line').attr('x1', 0).attr('x2', iw).attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', '#3a4a6b').attr('stroke-width', 1)

    g.append('text').attr('x', iw / 2).attr('y', ih + 34).attr('text-anchor', 'middle')
      .attr('fill', '#8b949e').attr('font-size', 12).text('평단가 (만원/평)')
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -ih / 2).attr('y', -40)
      .attr('text-anchor', 'middle').attr('fill', '#8b949e').attr('font-size', 12).text('전년 대비 변동률 (%)')

    // OLS
    const n = pts.length
    const sx = d3.sum(pts, (d) => d.price), sy = d3.sum(pts, (d) => d.yoy)
    const sxy = d3.sum(pts, (d) => d.price * d.yoy), sxx = d3.sum(pts, (d) => d.price * d.price)
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx)
    const intercept = (sy - slope * sx) / n
    const xd = x.domain()
    g.append('line')
      .attr('x1', x(xd[0])).attr('y1', y(intercept + slope * xd[0]))
      .attr('x2', x(xd[1])).attr('y2', y(intercept + slope * xd[1]))
      .attr('stroke', '#f778ba').attr('stroke-width', 2).attr('stroke-dasharray', '6 4')

    g.selectAll('circle').data(pts).join('circle')
      .attr('cx', (d) => x(d.price)).attr('cy', (d) => y(d.yoy))
      .attr('fill', (d) => (d.yoy >= 0 ? '#3fb950' : '#f778ba')).attr('fill-opacity', 0.85)
      .attr('stroke', '#0d1117').attr('stroke-width', 1).attr('r', 0)
      .append('title').text((d) => `${d.ko}\n평단가 ${d.price.toLocaleString()}만원 · ${d.yoy > 0 ? '+' : ''}${d.yoy}%`)
    g.selectAll('circle').transition().duration(600).delay((_, i) => i * 22).attr('r', 6)

    const r2sign = slope >= 0 ? '+' : ''
    g.append('text').attr('x', iw - 4).attr('y', 14).attr('text-anchor', 'end')
      .attr('fill', '#f778ba').attr('font-size', 12)
      .text(`ŷ = ${intercept.toFixed(1)} ${r2sign}${(slope * 1000).toFixed(2)}·(천만원)`)
  }, [pts])

  if (!pts.length) return <div className="loading">실거래 데이터 불러오는 중…</div>
  return <svg ref={ref} width="100%" height={300} role="img" aria-label="평단가-변동률 산점도" />
}
