export interface AllAppsResponse {
  result: string
  apps: AppResponse[]
}

export interface AppResponse {
  uuid: string
  name: string
  url: string
  logo: string
  description: string
  callback: string
  success_url: string
  cancel_url: string
  active: boolean
  enabled: boolean
  allowed_payment_auth: boolean
  card: boolean
  created_at: Date
  updated_at: Date
}

export interface AppCreateParams {
  name: string
  url: string
  logo: string
  callback: string
  success_url: string
  cancel_url: string
}

export interface AppCreateResponse {
  result: string
  app: NewApp
}

export interface NewApp {
  uuid: string
  secret: string
  name: string
  url: string
  desc: string
  logo: string
}
