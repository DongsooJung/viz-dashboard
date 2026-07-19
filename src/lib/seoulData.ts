// 서울 실거래 집계 데이터 로더.
// stargate-visual 리포(같은 stargateedu.co.kr 도메인, CORS 허용)의 assets에서 fetch.
// 데이터가 갱신되면 대시보드는 재빌드 없이 자동 반영된다.
export const DATA_BASE = 'https://stargateedu.co.kr/stargate-visual/assets'

export async function fetchJSON<T>(name: string): Promise<T> {
  const res = await fetch(`${DATA_BASE}/${name}`)
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`)
  return (await res.json()) as T
}

export interface GuRow {
  ko: string
  price: number
  vol: number
  yoy: number
  n: number
}
export interface GuPrices {
  meta: { source: string; period: string; metric: string }
  districts: Record<string, GuRow>
}
export interface MonthRow {
  month: string
  volume: number
  medianPyeong: number
}
export interface SeoulMonthly {
  meta: { source: string; period: string }
  series: MonthRow[]
}
export interface GuHeatmap {
  meta: { source: string; period: string }
  districts: string[]
  months: string[]
  z: number[][]
  unit: string
}
