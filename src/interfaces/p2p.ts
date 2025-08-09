import type { EnabledCurrencies } from '../helpers/constants'

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

export interface P2POffersResponse {
  currentPage: number
  data: P2POffer[]
  firstPageURL: string
  from: number
  lastPage: number
  lastPageURL: string
  links: {
    url: null | string
    label: string
    active: boolean
  }[]
  nextPageURL: null
  path: string
  perPage: number
  prevPageURL: null
  to: number
  total: number
}

export interface P2POffer {
  uuid: string
  userID: number
  type: 'buy' | 'sell'
  coin: string
  peerID: number
  amount: string
  receive: string
  onlyKyc: number
  private: number
  status: string
  createdAt: Date
  updatedAt: Date
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
  userID: number
  type: 'buy' | 'sell'
  coin: string
  peerID: number
  amount: string
  receive: string
  status: string
  createdAt: string
  updatedAt: string
  coinData: {
    id: number
    coinsCategoriesId: number
    name: string
    logo: string
    tick: string
    feeIn: string
    feeOut: string
    minIn: string
    minOut: string
    price: string
  }
  peer: {
    name: string
    username: string
    profilePhotoPath: string
    profilePhotoUrl: string
    completeName: string
    nameVerified: string
  }
  owner: {
    uuid: string
    username: string
    name: string
    lastname: string
    email: string
    bio: string
    profilePhotoPath: string
    profilePhotoUrl: string
    completeName: string
    nameVerified: string
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
  onlyKyc?: boolean | number
  private?: boolean | number
  promoteOffer?: boolean | number
  onlyVip?: boolean | number
}

export interface CreatedP2POffer {
  uuid: string
  userId: number
  type: 'buy' | 'sell'
  coin: string
  amount: number
  receive: number
  only_kyc: number
  private: number
  status: string
  updatedAt: string
  createdAt: string
}

export interface CreateP2POfferResponse {
  msg: string
  p2p: CreatedP2POffer
}

export interface AppliedP2POffer {
  id: number
  uuid: string
  userId: number
  type: 'buy' | 'sell'
  coin: string
  peerId: number
  amount: string
  receive: string
  onlyKyc: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface ApplyToOfferResponse {
  msg: string
  p2p: AppliedP2POffer
}
