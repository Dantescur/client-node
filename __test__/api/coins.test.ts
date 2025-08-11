import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Coins } from '../../src/api/coins'
import { QvaPayClient } from '../../src/core/client'
import type {
  CoinsResponse,
  CoinsV2Params,
  CoinsV2Response,
  CoinV2Response,
} from '../../src/interfaces'

describe('Coins API', () => {
  let client: QvaPayClient
  let coins: Coins
  let mockAxios: MockAdapter

  beforeEach(() => {
    client = new QvaPayClient({ baseUrl: 'https://api.qvapay.com' })
    coins = new Coins(client)
    // @ts-expect-error: access to private property for testing
    mockAxios = new MockAdapter(client.instance)
  })

  afterEach(() => {
    mockAxios.restore()
  })

  describe('getAll', () => {
    it('should fetch all coins with GET /coins', async () => {
      const mockResponse: CoinsResponse = {
        id: 2,
        logo: 'logo',
        name: 'Coin',
        coins: [
          {
            id: 1,
            name: 'Bitcoin',
            price: 50000,
            coins_categories_id: 1,
            created_at: new Date('2025-08-11T10:32:45.746Z'),
            enabled_in: 0,
            enabled_out: 0,
            enabled_p2p: 1,
            fee_in: '1',
            fee_out: ' 1',
            logo: 'logo',
            min_in: '1',
            min_out: '0',
            tick: 'tick',
            updated_at: new Date('2025-08-11T10:32:45.746Z'),
            working_data: 'yes',
          },
          {
            id: 2,
            name: 'Ethereum',
            price: 3000,

            coins_categories_id: 1,
            created_at: new Date('2025-08-11T10:32:45.746Z'),
            enabled_in: 0,
            enabled_out: 0,
            enabled_p2p: 1,
            fee_in: '1',
            fee_out: ' 1',
            logo: 'logo',
            min_in: '1',
            min_out: '0',
            tick: 'tick',
            updated_at: new Date('2025-08-11T10:32:45.746Z'),
            working_data: 'yes',
          },
        ],
      }

      mockAxios.onGet('/coins').reply(200, mockResponse)

      const result = await coins.getAll()

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/coins')
    })

    it('should throw error when getAll fails', async () => {
      mockAxios.onGet('/coins').reply(500, { error: 'Server error' })

      await expect(coins.getAll()).rejects.toThrow()
    })
  })

  describe('getV2', () => {
    it('should fetch coins v2 without params', async () => {
      const mockResponse: CoinsV2Response = [
        {
          coins_categories_id: '3',
          enabled_in: true,
          enabled_out: true,
          enabled_p2p: false,
          fee_in: '1',
          fee_out: '1',
          id: '1',
          logo: 'logo',
          min_in: 'min',
          min_out: 'max',
          name: 'name',
          network: null,
          price: 'price',
          tick: 'string',
        },
        {
          coins_categories_id: '3',
          enabled_in: true,
          enabled_out: true,
          enabled_p2p: false,
          fee_in: '1',
          fee_out: '1',
          id: '1',
          logo: 'logo',
          min_in: 'min',
          min_out: 'max',
          name: 'name',
          network: null,
          price: 'price',
          tick: 'string',
        },
      ]

      mockAxios.onGet('/coins/v2').reply(200, mockResponse)

      const result = await coins.getV2()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/coins/v2')
    })

    it('should fetch coins v2 with params', async () => {
      const params: CoinsV2Params = {
        enabled_in: true,
        enabled_out: true,
        enabled_p2p: true,
      }
      const mockResponse: CoinsV2Response = [
        {
          coins_categories_id: '3',
          enabled_in: true,
          enabled_out: true,
          enabled_p2p: false,
          fee_in: '1',
          fee_out: '1',
          id: '1',
          logo: 'logo',
          min_in: 'min',
          min_out: 'max',
          name: 'name',
          network: null,
          price: 'price',
          tick: 'string',
        },
        {
          coins_categories_id: '3',
          enabled_in: true,
          enabled_out: true,
          enabled_p2p: false,
          fee_in: '1',
          fee_out: '1',
          id: '1',
          logo: 'logo',
          min_in: 'min',
          min_out: 'max',
          name: 'name',
          network: null,
          price: 'price',
          tick: 'string',
        },
      ]

      mockAxios
        .onGet('/coins/v2?enabled_in=true&enabled_out=true&enabled_p2p=true')
        .reply(200, mockResponse)

      const result = await coins.getV2(params)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(
        '/coins/v2?enabled_in=true&enabled_out=true&enabled_p2p=true',
      )
    })

    it('should ignore undefined params', async () => {
      const params: CoinsV2Params = {
        enabled_in: undefined,
        enabled_out: true,
        enabled_p2p: false,
      }
      const mockResponse: CoinsV2Response = [
        {
          coins_categories_id: '3',
          enabled_in: true,
          enabled_out: true,
          enabled_p2p: false,
          fee_in: '1',
          fee_out: '1',
          id: '1',
          logo: 'logo',
          min_in: 'min',
          min_out: 'max',
          name: 'name',
          network: null,
          price: 'price',
          tick: 'string',
        },
        {
          coins_categories_id: '3',
          enabled_in: true,
          enabled_out: true,
          enabled_p2p: false,
          fee_in: '1',
          fee_out: '1',
          id: '1',
          logo: 'logo',
          min_in: 'min',
          min_out: 'max',
          name: 'name',
          network: null,
          price: 'price',
          tick: 'string',
        },
      ]

      mockAxios
        .onGet('/coins/v2?enabled_out=true&enabled_p2p=false')
        .reply(200, mockResponse)

      const result = await coins.getV2(params)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get[0].url).toBe(
        '/coins/v2?enabled_out=true&enabled_p2p=false',
      )
    })

    it('should throw error when getV2 fails', async () => {
      mockAxios.onGet('/coins/v2').reply(400, { error: 'Bad request' })

      await expect(coins.getV2()).rejects.toThrow()
    })
  })

  describe('getById', () => {
    it('should fetch a coin by ID', async () => {
      const coinId = 1
      const mockResponse: CoinV2Response = {
        id: coinId,
        name: 'Bitcoin',
        price: '50000',
        coin_category: {
          id: 3,
          logo: 'logo',
          name: 'Bitcoin',
        },
        coins_categories_id: 3,
        enabled_in: 0,
        enabled_out: 0,
        enabled_p2p: 1,
        fee_in: '12',
        fee_out: '12',
        logo: 'logo',
        max_in: 12,
        max_out: 13,
        min_in: '12',
        min_out: '123',
        tick: 'tick',
        working_data: 'since',
      }

      mockAxios.onGet(`/coins/${coinId}`).reply(200, mockResponse)

      const result = await coins.getById(coinId)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(`/coins/${coinId}`)
    })

    it('should throw error when getById fails', async () => {
      const coinId = 1
      mockAxios
        .onGet(`/coins/${coinId}`)
        .reply(404, { error: 'Coin not found' })

      await expect(coins.getById(coinId)).rejects.toThrow()
    })
  })
})
