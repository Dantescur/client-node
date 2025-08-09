import type { Me } from './user'

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  me: Me
}

export interface RegisterParams {
  name: string
  lastname?: string
  email: string
  password: string
  c_password: string
  invite?: string
}

export interface RegisterResponse {
  message: string
  access_token: string
}
