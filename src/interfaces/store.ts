export interface BuyProductParams {
  uuid: string
  amount: number
  value: number
}

export interface SingleProductResponse {
  uuid: string
  name: string
  lead: string
  price: string
  desc: string
  service_photo_url: string
}

export interface PurchasedProduct {
  id: number
  service_id: number
  service_data: string
  notes: string
  status: string
  amount: string
  transaction_id: number
  notified: string
  created_at: Date
  updated_at: Date
}

export interface PurchasedProductsResponse {
  current_page: number
  data: Datum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: null
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface Datum {
  id: number
  service_id: number
  service_data: string
  notes: string
  status: string
  amount: string
  transaction_id: number
  notified: string
  created_at: Date
  updated_at: Date
}

export interface Link {
  url: null | string
  label: string
  active: boolean
}

export interface StoreProductsResponse {
  current_page: number
  data: Data[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Link[]
  next_page_url: null
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface Data {
  uuid: string
  name: string
  lead: string
  price: string
  logo: string
  sublogo: string
  desc: string
}
