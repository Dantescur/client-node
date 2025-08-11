import { TwoFactorRequiredError } from '../core/errors'
import type { QvaPayClient } from '../core/client'
import type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
} from '../interfaces'

export class Auth {
  constructor(private readonly client: QvaPayClient) {}

  async login(loginData: LoginParams): Promise<LoginResponse> {
    const response = await this.client.request<
      LoginResponse | { info: string }
    >({
      method: 'POST',
      url: '/auth/login',
      data: loginData,
    })

    if ('info' in response) {
      throw new TwoFactorRequiredError(response.info)
    }

    this.client.setAuthToken(response.access_token)
    return response
  }

  async register(registerData: RegisterParams): Promise<RegisterResponse> {
    const response = await this.client.request<RegisterResponse>({
      method: 'POST',
      url: '/auth/register',
      data: registerData,
    })
    return response
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.client.request<{ message: string }>({
      method: 'GET',
      url: '/auth/logout',
    })
    this.client.clearAuthToken()
    return response
  }

  async check(): Promise<void> {
    await this.client.request({
      method: 'POST',
      url: 'auth/check',
    })
  }

  async twoFactorCheck(code: string): Promise<any> {
    return await this.client.request({
      method: 'POST',
      url: '/auth/two-factor',
      data: code,
    })
  }
}
