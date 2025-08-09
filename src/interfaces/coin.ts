export interface CoinsResponse {
  id: number
  name: string
  logo: string
  coins: Coin[]
}

export interface Coin {
  id: number
  coinsCategoriesID: number
  name: string
  logo: string
  tick: string
  feeIn: string
  feeOut: string
  minIn: string
  minOut: string
  workingData: string
  enabledIn: number
  enabledOut: number
  enabledP2P: number
  price: string
  createdAt: null
  updatedAt: Date | null
}

export interface CoinsV2Params {
  enabledIn?: boolean
  enabledOut?: boolean
  enabledP2P?: boolean
}

export interface CoinsV2 {
  id: string
  name: string
  tick: string
  minIn: string
  feeIn: string
  minOut: string
  feeOut: string
  enabledIn: boolean
  enabledOut: boolean
  enabledP2P: boolean
  coinsCategoriesID: string
  price: string
  logo: string
  network: null | string
}

export type CoinsV2Response = CoinsV2[]

export interface CoinV2Response {
  id: number
  coinsCategoriesID: number
  name: string
  logo: string
  tick: string
  feeIn: string
  feeOut: string
  minIn: string
  minOut: string
  maxIn: number
  maxOut: number
  workingData: string
  enabledIn: number
  enabledOut: number
  enabledP2P: number
  price: string
  coinCategory: CoinCategory
}

export interface CoinCategory {
  id: number
  name: string
  logo: string
}
