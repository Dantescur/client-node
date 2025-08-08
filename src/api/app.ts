import type { QvaPayClient } from '../helpers/axios'
import type {
  AllAppsResponse,
  AppCreateParams,
  AppCreateResponse,
  AppResponse,
} from '../interfaces/app'

export class App {
  constructor(private readonly client: QvaPayClient) {}

  async getAll(): Promise<AllAppsResponse> {
    const response = await this.client.request<AllAppsResponse>({
      method: 'GET',
      url: '/app',
    })

    return response
  }

  async get(uuid: string): Promise<AppResponse> {
    const response = await this.client.request<AppResponse>({
      method: 'GET',
      url: `/${uuid}`,
    })

    return response
  }

  async delete(uuid: string): Promise<AppResponse> {
    const response = await this.client.request<AppResponse>({
      method: 'DELETE',
      url: `/${uuid}`,
    })

    return response
  }

  async create(appParams: AppCreateParams): Promise<AppCreateResponse> {
    const response = await this.client.request<AppCreateResponse>({
      method: 'POST',
      url: '/app/create',
      data: appParams,
    })

    return response
  }
}
