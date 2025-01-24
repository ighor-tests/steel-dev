export interface MetricsResponse {
  bandwidth_usage: string
  top_sites: Array<{
    url: string
    visits: number
  }>
}
