export interface P2PAverageResponse {
  name: string
  tick: string
  average: number
}

export interface CompletedTradingPairsAverageResponse {
  average: number
  averageBuy: number
  averageSell: number
  medianBuy: number
  medianSell: number
  offers: number[]
}
