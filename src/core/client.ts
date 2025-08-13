import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { App } from '../api/app'
import { Auth } from '../api/auth'
import { Coins } from '../api/coins'
import { P2P } from '../api/p2p'
import { Transactions } from '../api/transactions'
import { User } from '../api/user'
import { handleApiError } from './errors'

export class QvaPayClient {
  private instance: AxiosInstance
  private authToken?: string
  debug: boolean

  // Public modules
  public auth: Auth
  public app: App
  public coins: Coins
  public p2p: P2P
  public user: User
  public transactions: Transactions

  constructor(
    config: { baseUrl?: string; authToken?: string; debug?: boolean } = {},
  ) {
    this.debug = config.debug || false
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
      if (this.debug) {
        console.info('Making request to url:', cfg.url)
        console.info('Request Headers:', cfg.headers)
        console.info('Request Data:', cfg.data)
      }
      return cfg
    })

    this.instance.interceptors.response.use(
      (response) => {
        if (this.debug) {
          console.info('Response Data:', response.data)
        }
        return response
      },
      (error) => {
        handleApiError(error, this.debug)
      },
    )

    this.auth = new Auth(this)
    this.app = new App(this)
    this.coins = new Coins(this)
    this.p2p = new P2P(this)
    this.user = new User(this)
    this.transactions = new Transactions(this)
  }

  private debugRequest(config: AxiosRequestConfig) {
    if (!this.debug) return

    console.log(`[QvaPay Debug] ${config.method?.toUpperCase()} ${config.url}`)
    if (config.params) console.log('Params:', config.params)
    if (config.data) console.log('Data:', config.data)
  }

  private debugResponse(response: AxiosResponse) {
    if (!this.debug) return

    console.log(`[QvaPay Debug] Response ${response.status}:`, {
      status: response.status,
      data: response.data,
      headers: response.headers,
    })
  }

  public setAuthToken(token: string): void {
    this.authToken = token
  }

  public clearAuthToken(): void {
    this.authToken = undefined
  }

  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    this.debugRequest(config)
    const response = await this.instance.request<T>(config)
    this.debugResponse(response)
    return response.data
  }
}
