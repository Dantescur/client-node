import type { Me } from './me'

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
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
  accessToken: string
}
