import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { User } from '../../src/api/user'
import { QvaPayClient } from '../../src/core/client'
import type {
  GoldPurchaseResponse,
  Me,
  MeExtendedResponse,
  TopUpParams,
  TopUpResponse,
  UpdateUserParams,
  UpdateUserResponse,
  UserSearchResult,
  UserWithdrawResponse,
  WithdrawRequest,
} from '../../src/interfaces'

describe('User API', () => {
  let client: QvaPayClient
  let user: User
  let mockAxios: MockAdapter

  beforeEach(() => {
    client = new QvaPayClient({ baseUrl: 'https://api.qvapay.com' })
    user = new User(client)
    // @ts-expect-error: access to private property for testing
    mockAxios = new MockAdapter(client.instance)
  })

  afterEach(() => {
    mockAxios.restore()
  })

  describe('getMe', () => {
    it('should fetch user information', async () => {
      const mockResponse: Me = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        name: 'Test',
        lastname: 'User',
        bio: 'Test bio',
        profile_photo_path: 'path/to/photo.jpg',
        balance: 1000,
        complete_name: 'Test User',
        name_verified: 'Verified Name',
        profile_photo_url: 'https://example.com/photo.jpg',
        average_rating: '4.5',
      }

      mockAxios.onGet('/user').reply(200, mockResponse)

      const result = await user.getMe()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/user')
    })

    it('should throw error when getMe fails', async () => {
      mockAxios.onGet('/user').reply(500, { error: 'Server error' })

      await expect(user.getMe()).rejects.toThrow()
    })
  })

  describe('getMeExtended', () => {
    it('should fetch extended user information', async () => {
      const mockResponse: MeExtendedResponse = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        name: 'Test',
        lastname: 'User',
        bio: 'Test bio',
        kyc: 1,
        goldenCheck: 1,
        completed_p2p: 10,
        ranking_position: 5,
        sales: 15,
        complete_name: 'Test User',
        name_verified: 'Verified Name',
        cover_photo_url: 'https://example.com/cover.jpg',
        profile_photo_url: 'https://example.com/photo.jpg',
        average_rating: '4.5',
      }

      mockAxios.onGet('/user/extended').reply(200, mockResponse)

      const result = await user.getMeExtended()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/user/extended')
    })

    it('should throw error when getMeExtended fails', async () => {
      mockAxios.onGet('/user/extended').reply(400, { error: 'Bad request' })

      await expect(user.getMeExtended()).rejects.toThrow()
    })
  })

  describe('getMeKycStatus', () => {
    it('should fetch KYC status', async () => {
      const mockResponse = { status: 'verified', level: 2 }
      mockAxios.onGet('/user/kyc').reply(200, mockResponse)

      const result = await user.getMeKycStatus()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/user/kyc')
    })

    it('should throw error when getMeKycStatus fails', async () => {
      mockAxios.onGet('/user/kyc').reply(403, { error: 'Forbidden' })

      await expect(user.getMeKycStatus()).rejects.toThrow()
    })
  })

  describe('updateMe', () => {
    it('should update user information', async () => {
      const params: UpdateUserParams = {
        name: 'Updated',
        lastname: 'User',
        bio: 'Updated bio',
        address: '123 Street',
        country: 'Country',
        telegram: '@test',
        twitter: '@test',
      }

      const mockResponse: UpdateUserResponse = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser',
        name: 'Updated',
        lastname: 'User',
        bio: 'Updated bio',
        logo: 'path/to/logo.jpg',
        balance: '1000',
        kyc: 1,
      }

      mockAxios.onPut('/user/update').reply(200, mockResponse)

      const result = await user.updateMe(params)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.put).toHaveLength(1)
      expect(mockAxios.history.put[0].url).toBe('/user/update')
      expect(JSON.parse(mockAxios.history.put[0].data)).toEqual(params)
    })

    it('should throw error when updateMe fails', async () => {
      mockAxios.onPut('/user/update').reply(400, { error: 'Invalid data' })

      // @ts-expect-error: in purpose
      await expect(user.updateMe({})).rejects.toThrow()
    })
  })

  describe('updateEmail', () => {
    it('should update email with PIN', async () => {
      const newEmail = 'new@example.com'
      const pin = '123456'
      const mockResponse = { success: true, message: 'Email updated' }

      mockAxios.onPut('/user/update/email').reply(200, mockResponse)

      const result = await user.updateEmail(newEmail, pin)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.put).toHaveLength(1)
      expect(mockAxios.history.put[0].url).toBe('/user/update/email')
      expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
        email: newEmail,
        pin,
      })
    })

    it('should request PIN for email update', async () => {
      const newEmail = 'new@example.com'
      const mockResponse = { success: true, message: 'PIN sent' }

      mockAxios.onPut('/user/update/email').reply(200, mockResponse)

      const result = await user.updateEmail(newEmail)

      expect(result).toEqual(mockResponse)
      expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
        email: newEmail,
        pin: '',
      })
    })

    it('should throw error when updateEmail fails', async () => {
      mockAxios
        .onPut('/user/update/email')
        .reply(400, { error: 'Invalid email' })

      await expect(user.updateEmail('invalid')).rejects.toThrow()
    })
  })

  describe('updateUsername', () => {
    it('should update username', async () => {
      const newUsername = 'newusername'
      const mockResponse = { success: true, username: newUsername }

      mockAxios.onPut('/user/update/username').reply(200, mockResponse)

      const result = await user.updateUsername(newUsername)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.put).toHaveLength(1)
      expect(mockAxios.history.put[0].url).toBe('/user/update/username')
      expect(JSON.parse(mockAxios.history.put[0].data)).toEqual({
        username: newUsername,
      })
    })

    it('should throw error when updateUsername fails', async () => {
      mockAxios
        .onPut('/user/update/username')
        .reply(400, { error: 'Username taken' })

      await expect(user.updateUsername('taken')).rejects.toThrow()
    })
  })

  describe('topUpBalance', () => {
    it('should top up balance', async () => {
      const params: TopUpParams = {
        pay_method: 'BTC',
        amount: 100,
        webhook_url: 'https://example.com/webhook',
      }

      const mockResponse: TopUpResponse = {
        response: 1,
        coin: 'BTC',
        value: '0.002',
        wallet: 'bc1q...',
        price: 50000,
        transaction_id: 'tx123',
      }

      mockAxios.onPost('/topup').reply(200, mockResponse)

      const result = await user.topUpBalance(params)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/topup')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(params)
    })

    it('should throw error when topUpBalance fails', async () => {
      mockAxios.onPost('/topup').reply(400, { error: 'Invalid amount' })

      await expect(
        user.topUpBalance({ pay_method: 'BTC', amount: 0 }),
      ).rejects.toThrow()
    })
  })

  describe('withdraw', () => {
    it('should withdraw funds', async () => {
      const request: WithdrawRequest = {
        pay_method: 'BTC',
        amount: 100,
        details: { wallet: 'bc1q...' },
        pin: 123456,
        note: 'Test withdrawal',
      }

      const mockResponse: UserWithdrawResponse = {
        userId: 1,
        transaction_id: 123,
        amount: 100,
        receive: 95,
        payment_method: 'BTC',
        details: '{"wallet":"bc1q..."}',
        status: 'pending',
        updated_at: '2025-08-11T10:32:45.746Z',
        created_at: '2025-08-11T10:32:45.746Z',
        id: 1,
      }

      mockAxios.onPost('/withdraw').reply(200, mockResponse)

      const result = await user.withdraw(request)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/withdraw')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(request)
    })

    it('should throw error when withdraw fails', async () => {
      mockAxios.onPost('/withdraw').reply(400, { error: 'Insufficient funds' })

      await expect(
        user.withdraw({
          pay_method: 'BTC',
          amount: 1000,
          details: { wallet: 'bc1q...' },
        }),
      ).rejects.toThrow()
    })
  })

  describe('buyGold', () => {
    it('should purchase Gold status', async () => {
      const csrf = 'csrf-token'
      const mockResponse: GoldPurchaseResponse = {
        success: true,
        message: 'Gold status purchased',
      }

      mockAxios.onPost('/gold').reply(200, mockResponse)

      const result = await user.buyGold(csrf)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/gold')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ csrf })
    })

    it('should throw error when buyGold fails', async () => {
      mockAxios.onPost('/gold').reply(400, { error: 'Invalid CSRF' })

      await expect(user.buyGold('invalid')).rejects.toThrow()
    })
  })

  describe('search', () => {
    it('should search for users', async () => {
      const query = 'test'
      const mockResponse: UserSearchResult = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test',
        lastname: 'User',
        username: 'testuser',
        kyc: true,
        golden_check: false,
        image: 'path/to/image.jpg',
        cover: 'path/to/cover.jpg',
      }

      mockAxios.onPost('/user/search').reply(200, mockResponse)

      const result = await user.search(query)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/user/search')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ query })
    })

    it('should throw error when search fails', async () => {
      mockAxios.onPost('/user/search').reply(400, { error: 'Invalid query' })

      await expect(user.search('')).rejects.toThrow()
    })
  })
})
