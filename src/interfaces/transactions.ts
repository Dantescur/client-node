export interface SearchTransactionsParams {
  take?: number
  user_id?: number
  start?: Date
  end?: Date
  status?: 'paid' | 'pending' | 'cancelled'
  remote_id?: string
  description?: string
}

export type LatestTransactionsParams = Omit<
  SearchTransactionsParams,
  'take' | 'user_id'
>

export interface TransactionsResponse {
  uuid: string
  app_id: number
  amount: string
  description: string
  remote_id: string
  status: string
  created_at: Date
  updated_at: Date
  logo: string
  app: App
  paid_by: Owner
  app_owner: App
  owner: Owner
  wallet: Wallet | null
  servicebuy: Servicebuy | null
}

interface App {
  logo: string
  url: string
  name: string
}

interface Owner {
  uuid?: string
  username: string
  name: string
  lastname?: string
  bio?: string
  logo: string
  kyc?: number
}

interface Servicebuy {
  service_id: number
  service_data: string
  status: string
  amount: string
  transaction_id: number
  created_at: Date
  updated_at: Date
  service: Service
}

interface Service {
  uuid: string
  name: string
  lead: string
  price: string
  logo: string
  sublogo: string
  desc: string
}

interface Wallet {
  transaction_id: number
  invoice_id: string
  wallet_type: string
  wallet: string
  value: string
  received: string
  txid: string
  status: string
  created_at: Date
  updated_at: Date
}

export type TransactionsDetailsParams = Omit<
  SearchTransactionsParams,
  'take' | 'user_id'
>

export type TransactionPDFParams = Omit<
  SearchTransactionsParams,
  'take' | 'user_id'
>

export interface WithdrawResponse {
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

interface Datum {
  id: number
  user_id: number
  transaction_id: number
  amount: string
  receive: string
  payment_method: string
  details: string
  status: string
  tx_id: null
  created_at: Date
  updated_at: Date
  transaction: Transaction
  coin: Coin
}

interface Coin {
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

interface Transaction {
  uuid: string
  app_id: number
  amount: string
  description: string
  remote_id: string
  status: string
  created_at: Date
  updated_at: Date
}

interface Link {
  url: null | string
  label: string
  active: boolean
}

export interface WithdrawDetailsResponse {
  id: number
  user_id: number
  transaction_id: number
  amount: string
  receive: string
  payment_method: string
  details: string
  status: string
  tx_id: null
  created_at: Date
  updated_at: Date
  transaction: Transaction
  coin: Coin
}

export interface TransferParams {
  amount: string
  description?: string
  /**
   * To can be either `uuid`, `email` or `phone number` of the recipient
   */
  to: string
  pin?: string
}

export interface TransferResponse {
  uuid: string
  app_id: number
  amount: number
  description: string
  remote_id: number
  status: string
  updated_at: Date
  created_at: Date
}

export interface PayTransactionParams {
  uuid: string
  pin: string
}

export interface PayTransactionResponse {
  uuid: string
  app_id: number
  amount: string
  description: string
  remote_id: string
  status: string
  created_at: Date
  updated_at: Date
  owner: Owner
}
