import type { QvaPayClient } from '../core/client'
import type {
  CoinsResponse,
  CoinsV2Params,
  CoinsV2Response,
  CoinV2Response,
} from '../interfaces'

export class Coins {
  constructor(private readonly client: QvaPayClient) {}

  async getAll(): Promise<CoinsResponse> {
    return await this.client.request<CoinsResponse>({
      method: 'GET',
      url: '/coins',
    })
  }

  async getV2(params?: CoinsV2Params): Promise<CoinsV2Response> {
    const queryParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const url = `/coins/v2${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    return await this.client.request<CoinsV2Response>({
      method: 'GET',
      url,
    })
  }

  async getById(id: number): Promise<CoinV2Response> {
    return await this.client.request<CoinV2Response>({
      method: 'GET',
      url: `/coins/${id}`,
    })
  }
}
