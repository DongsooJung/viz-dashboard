// 대시보드 데모용 지역 분석 데이터 (재현 가능한 시드 기반 생성)
// 실제 데이터 연결 시 이 파일만 교체하면 된다.

// 간단한 결정론적 PRNG (mulberry32) — 새로고침해도 동일한 그래프
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(20260704)

// ── 1) 월별 추이 (Recharts) ──────────────────────────────
export interface TrendPoint {
  month: string
  priceIndex: number // 가격지수 (기준 100)
  volume: number // 거래량
}

const MONTHS = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
]

export const monthlyTrend: TrendPoint[] = MONTHS.map((month, i) => {
  const trend = 100 + i * 1.6 + Math.sin(i / 2) * 3
  return {
    month,
    priceIndex: Math.round((trend + (rng() - 0.5) * 4) * 10) / 10,
    volume: Math.round(1200 + Math.cos(i / 3) * 380 + (rng() - 0.5) * 300),
  }
})

// ── 2) 접근성 vs 가격 산점도 (D3 — 헤도닉 관계) ──────────
export interface ScatterPoint {
  region: string
  accessibility: number // 교통 접근성 지표 (0~100)
  price: number // 평단가 (만원)
}

const REGIONS = [
  '강남', '서초', '송파', '용산', '마포', '성동', '광진', '동작',
  '영등포', '양천', '강동', '노원', '은평', '서대문', '종로', '중구',
  '강서', '구로', '금천', '관악', '동대문', '중랑', '성북', '도봉',
]

export const scatterData: ScatterPoint[] = REGIONS.map((region) => {
  const accessibility = Math.round(35 + rng() * 60)
  // price = 접근성에 선형 종속 + 노이즈 (기울기 ~28, 절편 ~600)
  const price = Math.round(600 + accessibility * 28 + (rng() - 0.5) * 900)
  return { region, accessibility, price }
})

// ── 3) 자치구 × 분기 가격 히트맵 (Plotly) ────────────────
export const heatmapDistricts = [
  '강남', '서초', '송파', '용산', '마포', '성동', '영등포', '노원',
]
export const heatmapQuarters = ['24-Q1', '24-Q2', '24-Q3', '24-Q4', '25-Q1', '25-Q2']

// z[구][분기] = 전분기 대비 가격 변동률(%)
export const heatmapZ: number[][] = heatmapDistricts.map((_, r) =>
  heatmapQuarters.map((_, c) => {
    const base = Math.sin((r + 1) / 2) * 2 + Math.cos(c / 1.5) * 1.5
    return Math.round((base + (rng() - 0.5) * 3) * 10) / 10
  }),
)

// ── KPI 요약 카드 ────────────────────────────────────────
export const kpis = [
  { label: '평균 가격지수', value: '112.4', delta: '+3.8%', up: true },
  { label: '월 거래량', value: '1,284', delta: '+6.1%', up: true },
  { label: '접근성-가격 상관', value: '0.83', delta: 'r', up: true },
  { label: '변동성(σ)', value: '2.7%', delta: '-0.4%p', up: false },
]
