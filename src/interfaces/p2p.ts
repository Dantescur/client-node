import type { EnabledCurrencies } from '../core/constants'

export interface P2PAverageResponse {
  name: string
  tick: string
  average: number
}

export interface CompletedTradingPairsAverageResponse {
  average: number
  average_buy: number
  average_sell: number
  median_buy: number
  median_sell: number
  offers: number[]
}

export interface P2POffersResponse {
  current_page: number
  data: P2POffer[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: null | string
    label: string
    active: boolean
  }[]
  next_page_url: null
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface P2POffer {
  uuid: string
  user_id: number
  type: 'buy' | 'sell'
  coin: string
  peer_id: number
  amount: string
  receive: string
  only_kyc: number
  private: number
  status: string
  created_at: Date
  updated_at: Date
}

export interface GetOfferParams {
  type?: 'buy' | 'sell'
  min?: number
  max?: number
  coin?: EnabledCurrencies
  my?: boolean
  vip?: boolean
}

export interface P2POfferDetails {
  id: number
  uuid: string
  user_id: number
  type: 'buy' | 'sell'
  coin: string
  peer_id: number
  amount: string
  receive: string
  status: string
  created_at: string
  updated_at: string
  coin_data: {
    id: number
    coins_categories_id: number
    name: string
    logo: string
    tick: string
    fee_in: string
    fee_out: string
    min_in: string
    min_out: string
    price: string
  }
  peer: {
    name: string
    username: string
    profile_photo_path: string
    profile_photo_url: string
    complete_name: string
    name_verified: string
  }
  owner: {
    uuid: string
    username: string
    name: string
    lastname: string
    email: string
    bio: string
    profile_photo_path: string
    profile_photo_url: string
    complete_name: string
    name_verified: string
  }
}

export interface P2PChatResponse {
  [key: string]: any
}

export interface CreateP2POfferParams {
  type: 'buy' | 'sell'
  coin: string | number
  amount: number
  receive: number
  details?:
    | Array<{
        name: string
        type: string
        value: string
      }>
    | string
  only_kyc?: boolean | number
  private?: boolean | number
  promote_offer?: boolean | number
  only_vip?: boolean | number
}

export interface CreatedP2POffer {
  uuid: string
  user_id: number
  type: 'buy' | 'sell'
  coin: string
  amount: number
  receive: number
  only_kyc: number
  private: number
  status: string
  updated_at: string
  created_at: string
}

export interface CreateP2POfferResponse {
  msg: string
  p2p: CreatedP2POffer
}

export interface AppliedP2POffer {
  id: number
  uuid: string
  user_id: number
  type: 'buy' | 'sell'
  coin: string
  peer_id: number
  amount: string
  receive: string
  only_kyc: number
  status: string
  created_at: string
  updated_at: string
}

export interface ApplyToOfferResponse {
  msg: string
  p2p: AppliedP2POffer
}
