import type { QvaPayClient } from '../helpers/axios'
import type {
  Login,
  LoginResponse,
  Register,
  RegisterResponse,
} from '../interfaces'

export class Auth {
  constructor(private readonly client: QvaPayClient) {}

  async login(loginData: Login): Promise<LoginResponse> {
    const response = await this.client.request<LoginResponse>({
      method: 'POST',
      url: '/auth/login',
      data: loginData,
    })

    this.client.setAuthToken(response.accessToken)
    return response
  }

  async register(registerData: Register): Promise<RegisterResponse> {
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
