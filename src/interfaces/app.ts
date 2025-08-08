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
  successURL: string
  cancelURL: string
  active: boolean
  enabled: boolean
  allowedPaymentAuth: boolean
  card: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AppCreateParams {
  name: string
  url: string
  logo: string
  callback: string
  successUrl: string
  cancelUrl: string
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
