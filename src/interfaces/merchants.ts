export interface AppParams {
  app_id: string
  app_secret: string
}

export interface AppInfoResponse {
  user_id: number
  name: string
  url: string
  desc: string
  callback: string
  success_url: string
  cancel_url: string
  logo: string
  uuid: string
  active: number
  enabled: number
  card: number
  created_at: Date
  updated_at: Date
  app_photo_url: string
}

export interface AppTransactionsParams extends AppParams {}

export interface AppTransactionsResponse {
  app_id: string
  amount: number
  description: string
  remote_id: string
  signed: number
  transation_uuid: string
  url: string
  signedUrl: string
}

export interface AuthorizePaymentsParams extends AppParams {
  remote_id: string
  callback: string
}

export interface AuthorizePaymentsResponse {
  app_id: string
  amount: number
  description: string
  remote_id: string
  signed: number
  transation_uuid: string
  url: string
  signedUrl: string
}

export interface ChargeUserParams extends AppParams {
  amount: number
  user_uuid: string
  description: string
  remote_id: string
}

export interface ChargeUserResponse {
  app_id: string
  amount: number
  description: string
  remote_id: string
  signed: number
  transation_uuid: string
  url: string
  signedUrl: string
}

export interface CreateInvoiceParams extends AppParams {
  amount: number
  description: string
  remote_id: string
  webhook: string
  products: Array<{
    name: string
    price: number
    quantity: number
  }>
}

export interface CreateInvoiceResponse {
  app_id: string
  amount: number
  description: string
  remote_id: string
  signed: number
  transation_uuid: string
  url: string
  signedUrl: string
}

export interface TransactionStatusParams extends AppParams {}

export interface TransactionStatusResponse {
  app_id: string
  amount: number
  description: string
  remote_id: string
  signed: number
  transation_uuid: string
  url: string
  signedUrl: string
}
