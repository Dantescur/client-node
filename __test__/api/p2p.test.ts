import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { P2P } from '../../src/api/p2p'
import { QvaPayClient } from '../../src/core/client'
import type {
  ApplyToOfferResponse,
  CompletedTradingPairsAverageResponse,
  CreateP2POfferParams,
  CreateP2POfferResponse,
  GetOfferParams,
  P2PAverageResponse,
  P2PChatResponse,
  P2POfferDetails,
  P2POffersResponse,
} from '../../src/interfaces'

describe('P2P API', () => {
  let client: QvaPayClient
  let p2p: P2P
  let mockAxios: MockAdapter

  beforeEach(() => {
    client = new QvaPayClient({ baseUrl: 'https://api.qvapay.com' })
    p2p = new P2P(client)
    // @ts-expect-error: access to private property for testing
    mockAxios = new MockAdapter(client.instance)
  })

  afterEach(() => {
    mockAxios.restore()
  })

  describe('getWelcomeMessage', () => {
    it('should fetch welcome message', async () => {
      const mockResponse = { message: 'Welcome to QvaPay P2P API' }
      mockAxios.onGet('/p2p').reply(200, mockResponse)

      const result = await p2p.getWelcomeMessage()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/p2p')
    })

    it('should throw error when getWelcomeMessage fails', async () => {
      mockAxios.onGet('/p2p').reply(500, { error: 'Server error' })

      await expect(p2p.getWelcomeMessage()).rejects.toThrow()
    })
  })

  describe('getWeeklyAverage', () => {
    it('should fetch weekly average', async () => {
      const mockResponse: P2PAverageResponse = {
        name: 'Bitcoin',
        tick: 'BTC',
        average: 50000,
      }
      mockAxios.onGet('/p2p/average').reply(200, mockResponse)

      const result = await p2p.getWeeklyAverage()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/p2p/average')
    })

    it('should throw error when getWeeklyAverage fails', async () => {
      mockAxios.onGet('/p2p/average').reply(400, { error: 'Bad request' })

      await expect(p2p.getWeeklyAverage()).rejects.toThrow()
    })
  })

  describe('getCompletedPairsAverages', () => {
    it('should fetch completed pairs averages without params', async () => {
      const mockResponse: CompletedTradingPairsAverageResponse = {
        average: 50000,
        average_buy: 49000,
        average_sell: 51000,
        median_buy: 49500,
        median_sell: 50500,
        offers: [49000, 50000, 51000],
      }
      mockAxios.onGet('/p2p/completed_pairs_average').reply(200, mockResponse)

      const result = await p2p.getCompletedPairsAverages()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/p2p/completed_pairs_average')
    })

    it('should fetch completed pairs averages with params', async () => {
      const mockResponse: CompletedTradingPairsAverageResponse = {
        average: 1.05,
        average_buy: 1.04,
        average_sell: 1.06,
        median_buy: 1.045,
        median_sell: 1.055,
        offers: [1.04, 1.05, 1.06],
      }
      mockAxios
        .onGet('/p2p/completed_pairs_average?coins=USDT')
        .reply(200, mockResponse)

      const result = await p2p.getCompletedPairsAverages('USDT')

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(
        '/p2p/completed_pairs_average?coins=USDT',
      )
    })

    it('should throw error when getCompletedPairsAverages fails', async () => {
      mockAxios
        .onGet('/p2p/completed_pairs_average')
        .reply(500, { error: 'Server error' })

      await expect(p2p.getCompletedPairsAverages()).rejects.toThrow()
    })
  })

  describe('getPublicOperationsCount', () => {
    it('should fetch public operations count', async () => {
      const mockResponse = { buy: 10, sell: 15 }
      mockAxios.onGet('/p2p/get_total_operations').reply(200, mockResponse)

      const result = await p2p.getPublicOperationsCount()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/p2p/get_total_operations')
    })

    it('should throw error when getPublicOperationsCount fails', async () => {
      mockAxios
        .onGet('/p2p/get_total_operations')
        .reply(400, { error: 'Bad request' })

      await expect(p2p.getPublicOperationsCount()).rejects.toThrow()
    })
  })

  describe('getOffers', () => {
    it('should fetch offers without params', async () => {
      const mockResponse: P2POffersResponse = {
        current_page: 1,
        data: [
          {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            user_id: 1,
            type: 'buy',
            coin: 'BTC',
            peer_id: 2,
            amount: '0.1',
            receive: '5000',
            only_kyc: 0,
            private: 0,
            status: 'open',
            created_at: new Date('2025-08-11T10:32:45.746Z'),
            updated_at: new Date('2025-08-11T10:32:45.746Z'),
          },
        ],
        first_page_url: 'https://api.qvapay.com/p2p/index?page=1',
        from: 1,
        last_page: 1,
        last_page_url: 'https://api.qvapay.com/p2p/index?page=1',
        links: [
          {
            url: null,
            label: '&laquo; Previous',
            active: false,
          },
          {
            url: 'https://api.qvapay.com/p2p/index?page=1',
            label: '1',
            active: true,
          },
          {
            url: null,
            label: 'Next &raquo;',
            active: false,
          },
        ],
        next_page_url: null,
        path: 'https://api.qvapay.com/p2p/index',
        per_page: 15,
        prev_page_url: null,
        to: 1,
        total: 1,
      }
      mockAxios.onGet('/p2p/index').reply(200, mockResponse)

      const result = await p2p.getOffers()

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/p2p/index')
    })

    it('should fetch offers with params', async () => {
      const params: GetOfferParams = {
        type: 'buy',
        min: 100,
        max: 1000,
        coin: 'USDT',
        my: true,
        vip: true,
      }
      const mockResponse: P2POffersResponse = {
        current_page: 1,
        data: [
          {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            user_id: 1,
            type: 'buy',
            coin: 'USDT',
            peer_id: 2,
            amount: '100',
            receive: '105',
            only_kyc: 1,
            private: 0,
            status: 'open',
            created_at: new Date('2025-08-11T10:32:45.746Z'),
            updated_at: new Date('2025-08-11T10:32:45.746Z'),
          },
        ],
        first_page_url: 'https://api.qvapay.com/p2p/index?page=1',
        from: 1,
        last_page: 1,
        last_page_url: 'https://api.qvapay.com/p2p/index?page=1',
        links: [
          {
            url: null,
            label: '&laquo; Previous',
            active: false,
          },
          {
            url: 'https://api.qvapay.com/p2p/index?page=1',
            label: '1',
            active: true,
          },
          {
            url: null,
            label: 'Next &raquo;',
            active: false,
          },
        ],
        next_page_url: null,
        path: 'https://api.qvapay.com/p2p/index',
        per_page: 15,
        prev_page_url: null,
        to: 1,
        total: 1,
      }
      mockAxios
        .onGet(
          '/p2p/index?type=buy&min=100&max=1000&coin=USDT&my=true&vip=true',
        )
        .reply(200, mockResponse)

      const result = await p2p.getOffers(params)

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get[0].url).toBe(
        '/p2p/index?type=buy&min=100&max=1000&coin=USDT&my=true&vip=true',
      )
    })

    it('should ignore undefined params', async () => {
      const params: GetOfferParams = {
        type: undefined,
        min: 100,
        max: undefined,
        coin: 'USDTBSC',
      }
      const mockResponse: P2POffersResponse = {
        current_page: 1,
        data: [
          {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            user_id: 1,
            type: 'buy',
            coin: 'BTC',
            peer_id: 2,
            amount: '0.1',
            receive: '5000',
            only_kyc: 0,
            private: 0,
            status: 'open',
            created_at: new Date('2025-08-11T10:32:45.746Z'),
            updated_at: new Date('2025-08-11T10:32:45.746Z'),
          },
        ],
        first_page_url: 'https://api.qvapay.com/p2p/index?page=1',
        from: 1,
        last_page: 1,
        last_page_url: 'https://api.qvapay.com/p2p/index?page=1',
        links: [
          {
            url: null,
            label: '&laquo; Previous',
            active: false,
          },
          {
            url: 'https://api.qvapay.com/p2p/index?page=1',
            label: '1',
            active: true,
          },
          {
            url: null,
            label: 'Next &raquo;',
            active: false,
          },
        ],
        next_page_url: null,
        path: 'https://api.qvapay.com/p2p/index',
        per_page: 15,
        prev_page_url: null,
        to: 1,
        total: 1,
      }
      mockAxios
        .onGet('/p2p/index?min=100&coin=USDTBSC') // Changed from BTC to USDTBSC to match params
        .reply(200, mockResponse)

      const result = await p2p.getOffers(params)

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get[0].url).toBe(
        '/p2p/index?min=100&coin=USDTBSC',
      )
    })

    it('should throw error when getOffers fails', async () => {
      mockAxios.onGet('/p2p/index').reply(500, { error: 'Server error' })

      await expect(p2p.getOffers()).rejects.toThrow()
    })
  })

  describe('getMyOffers', () => {
    it('should fetch my offers without params', async () => {
      const mockResponse: P2POffersResponse = {
        current_page: 1,
        data: [
          {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            user_id: 1,
            type: 'buy',
            coin: 'BTC',
            peer_id: 2,
            amount: '0.1',
            receive: '5000',
            only_kyc: 0,
            private: 0,
            status: 'open',
            created_at: new Date('2025-08-11T10:32:45.746Z'),
            updated_at: new Date('2025-08-11T10:32:45.746Z'),
          },
        ],
        first_page_url: 'https://api.qvapay.com/p2p/my?page=1',
        from: 1,
        last_page: 1,
        last_page_url: 'https://api.qvapay.com/p2p/my?page=1',
        links: [
          {
            url: null,
            label: '&laquo; Previous',
            active: false,
          },
          {
            url: 'https://api.qvapay.com/p2p/my?page=1',
            label: '1',
            active: true,
          },
          {
            url: null,
            label: 'Next &raquo;',
            active: false,
          },
        ],
        next_page_url: null,
        path: 'https://api.qvapay.com/p2p/my',
        per_page: 15,
        prev_page_url: null,
        to: 1,
        total: 1,
      }
      mockAxios.onGet('/p2p/my').reply(200, mockResponse)

      const result = await p2p.getMyOffers()

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/p2p/my')
    })

    it('should fetch my offers with params', async () => {
      const params: GetOfferParams = {
        type: 'sell',
        min: 50,
        coin: 'SOL',
        vip: true,
      }
      const mockResponse: P2POffersResponse = {
        current_page: 1,
        data: [
          {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            user_id: 1,
            type: 'sell',
            coin: 'SOL',
            peer_id: 2,
            amount: '1',
            receive: '3000',
            only_kyc: 1,
            private: 1,
            status: 'open',
            created_at: new Date('2025-08-11T10:32:45.746Z'),
            updated_at: new Date('2025-08-11T10:32:45.746Z'),
          },
        ],
        first_page_url: 'https://api.qvapay.com/p2p/my?page=1',
        from: 1,
        last_page: 1,
        last_page_url: 'https://api.qvapay.com/p2p/my?page=1',
        links: [
          {
            url: null,
            label: '&laquo; Previous',
            active: false,
          },
          {
            url: 'https://api.qvapay.com/p2p/my?page=1',
            label: '1',
            active: true,
          },
          {
            url: null,
            label: 'Next &raquo;',
            active: false,
          },
        ],
        next_page_url: null,
        path: 'https://api.qvapay.com/p2p/my',
        per_page: 15,
        prev_page_url: null,
        to: 1,
        total: 1,
      }
      mockAxios
        .onGet('/p2p/my?type=sell&min=50&coin=SOL&vip=true')
        .reply(200, mockResponse)

      const result = await p2p.getMyOffers(params)

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get[0].url).toBe(
        '/p2p/my?type=sell&min=50&coin=SOL&vip=true',
      )
    })

    it('should throw error when getMyOffers fails', async () => {
      mockAxios.onGet('/p2p/my').reply(400, { error: 'Bad request' })

      await expect(p2p.getMyOffers()).rejects.toThrow()
    })
  })

  describe('getOfferDetail', () => {
    it('should fetch offer details', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      const mockResponse: P2POfferDetails = {
        id: 1,
        uuid: offerId,
        user_id: 1,
        type: 'buy',
        coin: 'BTC',
        peer_id: 2,
        amount: '0.1',
        receive: '5000',
        status: 'open',
        created_at: '2025-08-11T10:32:45.746Z',
        updated_at: '2025-08-11T10:32:45.746Z',
        coin_data: {
          id: 1,
          coins_categories_id: 1,
          name: 'Bitcoin',
          logo: 'logo.png',
          tick: 'BTC',
          fee_in: '0.0001',
          fee_out: '0.0001',
          min_in: '0.001',
          min_out: '0.001',
          price: '50000',
        },
        peer: {
          name: 'Peer Name',
          username: 'peer',
          profile_photo_path: 'path.jpg',
          profile_photo_url: 'url.jpg',
          complete_name: 'Peer Complete Name',
          name_verified: 'Peer Verified Name',
        },
        owner: {
          uuid: '123e4567-e89b-12d3-a456-426614174001',
          username: 'owner',
          name: 'Owner',
          lastname: 'Lastname',
          email: 'owner@example.com',
          bio: 'Bio',
          profile_photo_path: 'path.jpg',
          profile_photo_url: 'url.jpg',
          complete_name: 'Owner Complete Name',
          name_verified: 'Owner Verified Name',
        },
      }
      mockAxios.onGet(`/p2p/${offerId}`).reply(200, mockResponse)

      const result = await p2p.getOfferDetail(offerId)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(`/p2p/${offerId}`)
    })

    it('should throw error when getOfferDetail fails', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      mockAxios
        .onGet(`/p2p/${offerId}`)
        .reply(404, { error: 'Offer not found' })

      await expect(p2p.getOfferDetail(offerId)).rejects.toThrow()
    })
  })

  describe('getOfferChat', () => {
    it('should fetch offer chat', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      const mockResponse: P2PChatResponse = {
        messages: [
          {
            id: 1,
            user_id: 1,
            text: 'Hello',
            created_at: '2025-08-11T10:32:45.746Z',
          },
        ],
      }
      mockAxios.onGet(`/p2p/${offerId}/chat`).reply(200, mockResponse)

      const result = await p2p.getOfferChat(offerId)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(`/p2p/${offerId}/chat`)
    })

    it('should throw error when getOfferChat fails', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      mockAxios
        .onGet(`/p2p/${offerId}/chat`)
        .reply(403, { error: 'Access denied' })

      await expect(p2p.getOfferChat(offerId)).rejects.toThrow()
    })
  })

  describe('createOffer', () => {
    it('should create a new offer', async () => {
      const params: CreateP2POfferParams = {
        type: 'buy',
        coin: 'BTC',
        amount: 0.1,
        receive: 5000,
        details: [
          { name: 'Bank', type: 'text', value: 'My Bank' },
          { name: 'Account', type: 'text', value: '123456' },
        ],
        only_kyc: true,
      }
      const mockResponse: CreateP2POfferResponse = {
        msg: 'Offer created',
        p2p: {
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          user_id: 1,
          type: 'buy',
          coin: 'BTC',
          amount: 0.1,
          receive: 5000,
          only_kyc: 1,
          private: 0,
          status: 'open',
          updated_at: '2025-08-11T10:32:45.746Z',
          created_at: '2025-08-11T10:32:45.746Z',
        },
      }
      mockAxios.onPost('/p2p/create').reply(200, mockResponse)

      const result = await p2p.createOffer(params)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/p2p/create')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
        type: 'buy',
        coin: 'BTC',
        amount: 0.1,
        receive: 5000,
        details: JSON.stringify(params.details),
        only_kyc: 1,
        private: 0,
        promote_offer: 0,
        only_vip: 0,
      })
    })

    it('should create offer with string details', async () => {
      const params: CreateP2POfferParams = {
        type: 'sell',
        coin: 'USDT',
        amount: 100,
        receive: 95,
        details: JSON.stringify([
          { name: 'Wallet', type: 'text', value: 'My Wallet' },
        ]),
        private: true,
      }
      const mockResponse: CreateP2POfferResponse = {
        msg: 'Offer created',
        p2p: {
          uuid: '123e4567-e89b-12d3-a456-426614174001',
          user_id: 1,
          type: 'sell',
          coin: 'USDT',
          amount: 100,
          receive: 95,
          only_kyc: 0,
          private: 1,
          status: 'open',
          updated_at: '2025-08-11T10:32:45.746Z',
          created_at: '2025-08-11T10:32:45.746Z',
        },
      }
      mockAxios.onPost('/p2p/create').reply(200, mockResponse)

      const result = await p2p.createOffer(params)

      expect(result).toEqual(mockResponse)
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({
        type: 'sell',
        coin: 'USDT',
        amount: 100,
        receive: 95,
        details: params.details,
        only_kyc: 0,
        private: 1,
        promote_offer: 0,
        only_vip: 0,
      })
    })

    it('should throw error when createOffer fails', async () => {
      const params: CreateP2POfferParams = {
        type: 'buy',
        coin: 'BTC',
        amount: 0.1,
        receive: 5000,
      }
      mockAxios.onPost('/p2p/create').reply(400, { error: 'Invalid params' })

      await expect(p2p.createOffer(params)).rejects.toThrow()
    })
  })

  describe('applyToOffer', () => {
    it('should apply to an offer', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      const mockResponse: ApplyToOfferResponse = {
        msg: 'Applied successfully',
        p2p: {
          id: 1,
          uuid: offerId,
          user_id: 1,
          type: 'buy',
          coin: 'BTC',
          peer_id: 2,
          amount: '0.1',
          receive: '5000',
          only_kyc: 1,
          status: 'pending',
          created_at: '2025-08-11T10:32:45.746Z',
          updated_at: '2025-08-11T10:32:45.746Z',
        },
      }
      mockAxios.onPost(`/p2p/${offerId}/apply`).reply(200, mockResponse)

      const result = await p2p.applyToOffer(offerId)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe(`/p2p/${offerId}/apply`)
    })

    it('should throw error when applyToOffer fails', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      mockAxios
        .onPost(`/p2p/${offerId}/apply`)
        .reply(403, { error: 'Not allowed' })

      await expect(p2p.applyToOffer(offerId)).rejects.toThrow()
    })
  })

  describe('cancelOffer', () => {
    it('should cancel an offer', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      mockAxios.onPost(`/p2p/${offerId}/cancel`).reply(200)

      await p2p.cancelOffer(offerId)

      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe(`/p2p/${offerId}/cancel`)
    })

    it('should throw error when cancelOffer fails', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      mockAxios
        .onPost(`/p2p/${offerId}/cancel`)
        .reply(404, { error: 'Offer not found' })

      await expect(p2p.cancelOffer(offerId)).rejects.toThrow()
    })
  })

  describe('sendMessage', () => {
    it('should send message to offer chat', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      const text = 'Hello, is this still available?'
      const mockResponse: ApplyToOfferResponse = {
        msg: 'Message sent',
        p2p: {
          id: 1,
          uuid: offerId,
          user_id: 1,
          type: 'buy',
          coin: 'BTC',
          peer_id: 2,
          amount: '0.1',
          receive: '5000',
          only_kyc: 1,
          status: 'open',
          created_at: '2025-08-11T10:32:45.746Z',
          updated_at: '2025-08-11T10:32:45.746Z',
        },
      }
      mockAxios.onPost(`/p2p/${offerId}/chat`).reply(200, mockResponse)

      const result = await p2p.sendMessage(offerId, text)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe(`/p2p/${offerId}/chat`)
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual({ text })
    })

    it('should throw error when sendMessage fails', async () => {
      const offerId = '123e4567-e89b-12d3-a456-426614174000'
      const text = 'Hello'
      mockAxios
        .onPost(`/p2p/${offerId}/chat`)
        .reply(400, { error: 'Invalid message' })

      await expect(p2p.sendMessage(offerId, text)).rejects.toThrow()
    })
  })
})
