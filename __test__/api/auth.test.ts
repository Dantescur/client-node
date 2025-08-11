import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Auth } from '../../src/api/auth'
import { QvaPayClient } from '../../src/core/client'
import { TwoFactorRequiredError } from '../../src/core/errors'
import type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
} from '../../src/interfaces'

describe('Auth API', () => {
  let client: QvaPayClient
  let auth: Auth
  let mockAxios: MockAdapter

  beforeEach(() => {
    client = new QvaPayClient({ baseUrl: 'https://api.qvapay.com' })
    auth = new Auth(client)
    // @ts-expect-error: accessing private property for testing
    mockAxios = new MockAdapter(client.instance)
  })

  afterEach(() => {
    mockAxios.restore()
    vi.restoreAllMocks()
  })

  describe('login', () => {
    it('should login successfully and set auth token', async () => {
      const loginData: LoginParams = {
        email: 'user@example.com',
        password: 'pass123',
      }
      const mockResponse: LoginResponse = {
        access_token: 'token-123',
        token_type: 'Bearer',
        me: {
          average_rating: 'all',
          balance: 10,
          bio: 'Bio',
          complete_name: 'Daniel Saucedo',
          lastname: 'Saucedo',
          name: 'Daniel',
          name_verified: 'Cesar Daniel',
          profile_photo_path: '/url/myphoto.jpeg',
          profile_photo_url: 'https://photo.qvapay.com/sdauy89/myphoto.jpeg',
          username: 'dantescur',
          uuid: 'ac53d292-d825-4f49-8df2-62c3fe84310f',
        },
      }

      const setAuthTokenSpy = vi.spyOn(client, 'setAuthToken')

      mockAxios.onPost('/auth/login').reply(200, mockResponse)

      const result = await auth.login(loginData)

      expect(result).toEqual(mockResponse)
      expect(setAuthTokenSpy).toHaveBeenCalledWith('token-123')
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/auth/login')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(loginData)
    })

    it('should throw TwoFactorRequiredError if "info" key exists in response', async () => {
      const loginData: LoginParams = {
        email: 'user@example.com',
        password: 'pass123',
      }
      const mockResponse = { info: '2FA required' }

      mockAxios.onPost('/auth/login').reply(200, mockResponse)

      await expect(auth.login(loginData)).rejects.toBeInstanceOf(
        TwoFactorRequiredError,
      )
    })

    it('should throw error when login fails', async () => {
      const loginData: LoginParams = {
        email: 'user@example.com',
        password: 'pass123',
      }

      mockAxios
        .onPost('/auth/login')
        .reply(401, { error: 'Invalid credentials' })

      await expect(auth.login(loginData)).rejects.toThrow()
    })
  })

  describe('register', () => {
    it('should register a new user', async () => {
      const registerData: RegisterParams = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass123',
        c_password: 'pass123',
      }

      const mockResponse: RegisterResponse = {
        access_token: 'test-token',
        message: 'success',
      }

      mockAxios.onPost('/auth/register').reply(200, mockResponse)

      const result = await auth.register(registerData)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/auth/register')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(registerData)
    })

    it('should throw error when register fails', async () => {
      const registerData: RegisterParams = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass123',
        c_password: 'pass123',
      }

      mockAxios
        .onPost('/auth/register')
        .reply(400, { error: 'Invalid parameters' })

      await expect(auth.register(registerData)).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should logout and clear auth token', async () => {
      const mockResponse = { message: 'Logged out' }
      const clearAuthTokenSpy = vi.spyOn(client, 'clearAuthToken')

      mockAxios.onGet('/auth/logout').reply(200, mockResponse)

      const result = await auth.logout()

      expect(result).toEqual(mockResponse)
      expect(clearAuthTokenSpy).toHaveBeenCalled()
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/auth/logout')
    })

    it('should throw error when logout fails', async () => {
      mockAxios.onGet('/auth/logout').reply(500, { error: 'Server error' })

      await expect(auth.logout()).rejects.toThrow()
    })
  })

  describe('check', () => {
    it('should perform auth check', async () => {
      mockAxios.onPost('auth/check').reply(200)

      await auth.check()

      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('auth/check')
    })

    it('should throw error when check fails', async () => {
      mockAxios.onPost('auth/check').reply(401, { error: 'Unauthorized' })

      await expect(auth.check()).rejects.toThrow()
    })
  })

  describe('twoFactorCheck', () => {
    it('should send 2FA code', async () => {
      const code = '123456'
      const mockResponse = { success: true }

      mockAxios.onPost('/auth/two-factor').reply(200, mockResponse)

      const result = await auth.twoFactorCheck(code)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/auth/two-factor')
      expect(mockAxios.history.post[0].data).toBe(code)
    })

    it('should throw error when 2FA check fails', async () => {
      const code = '123456'
      mockAxios.onPost('/auth/two-factor').reply(400, { error: 'Invalid code' })

      await expect(auth.twoFactorCheck(code)).rejects.toThrow()
    })
  })
})
