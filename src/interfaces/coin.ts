export interface CoinsResponse {
  id: number
  name: string
  logo: string
  coins: Coin[]
}

export interface Coin {
  id: number
  coins_categories_id: number
  name: string
  logo: string
  tick: string
  fee_in: string
  fee_out: string
  min_in: string
  min_out: string
  working_data: string
  enabled_in: number
  enabled_out: number
  enabled_p2p: number
  price: number
  created_at: Date | null
  updated_at: Date | null
}

export interface CoinsV2Params {
  enabled_in?: boolean
  enabled_out?: boolean
  enabled_p2p?: boolean
}

export interface CoinsV2 {
  id: string
  name: string
  tick: string
  min_in: string
  fee_in: string
  min_out: string
  fee_out: string
  enabled_in: boolean
  enabled_out: boolean
  enabled_p2p: boolean
  coins_categories_id: string
  price: string
  logo: string
  network: null | string
}

export type CoinsV2Response = CoinsV2[]

export interface CoinV2Response {
  id: number
  coins_categories_id: number
  name: string
  logo: string
  tick: string
  fee_in: string
  fee_out: string
  min_in: string
  min_out: string
  max_in: number
  max_out: number
  working_data: string
  enabled_in: number
  enabled_out: number
  enabled_p2p: number
  price: string
  coin_category: CoinCategory
}

export interface CoinCategory {
  id: number
  name: string
  logo: string
}
