import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { handleApiError } from './errors'

export class QvaPayClient {
  private instance: AxiosInstance
  private authToken?: string

  constructor(config: { baseUrl?: string; authToken?: string } = {}) {
    this.instance = axios.create({
      baseURL: config.baseUrl || 'https://api.qvapay.com',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (config.authToken) {
      this.setAuthToken(config.authToken)
    }

    this.instance.interceptors.request.use((cfg) => {
      if (this.authToken && !cfg.headers.Authorization) {
        cfg.headers.Authorization = `Bearer ${this.authToken}`
      }
      return cfg
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        handleApiError(error)
      },
    )
  }

  public setAuthToken(token: string): void {
    this.authToken = token
  }

  public clearAuthToken(): void {
    this.authToken = undefined
  }

  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<T>(config)
    return response.data
  }
}
