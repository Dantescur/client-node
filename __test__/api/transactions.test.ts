import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Transactions } from '../../src/api/transactions'
import { QvaPayClient } from '../../src/core/client'
import type {
  LatestTransactionsParams,
  PayTransactionResponse,
  SearchTransactionsParams,
  TransactionsResponse,
  TransferResponse,
  WithdrawDetailsResponse,
} from '../../src/interfaces'

describe('Transactions API', () => {
  let client: QvaPayClient
  let transactions: Transactions
  let mockAxios: MockAdapter

  beforeEach(() => {
    client = new QvaPayClient({ baseUrl: 'https://api.qvapay.com' })
    transactions = new Transactions(client)
    // @ts-expect-error: access to private property for testing
    mockAxios = new MockAdapter(client.instance)
  })

  afterEach(() => {
    mockAxios.restore()
  })

  describe('search', () => {
    it('should search transactions with params', async () => {
      const params: SearchTransactionsParams = {
        take: 10,
        user_id: 1,
        start: new Date('2023-01-01'),
        end: new Date('2023-12-31'),
        status: 'paid',
        remote_id: 'TEST123',
        description: 'Test',
      }

      const mockResponse: TransactionsResponse[] = [
        {
          uuid: '2f76f05e-2cda-4042-9e97-3777745d740e',
          app_id: 0,
          amount: '-1',
          description: 'Test transaction',
          remote_id: 'TEST123',
          status: 'paid',
          created_at: new Date('2023-06-15T03:00:47.000Z'),
          updated_at: new Date('2023-06-15T03:01:05.000Z'),
          logo: 'apps/qvapay.jpg',
          app: {
            logo: 'apps/qvapay.jpg',
            url: 'https://qvapay.com',
            name: 'QvaPay',
          },
          paid_by: {
            uuid: '18da6b91-b13e-4ffa-a932-bac1a8b113c3',
            username: 'testuser',
            name: 'Test',
            lastname: 'User',
            bio: '',
            logo: '',
            kyc: 0,
          },
          app_owner: {
            logo: 'apps/qvapay.jpg',
            url: 'https://qvapay.com',
            name: 'QvaPay',
          },
          owner: {
            uuid: '796a9e01-3d67-4a42-9dc2-02a5d069fa23',
            username: 'recipient',
            name: 'Recipient',
            lastname: 'User',
            bio: '',
            logo: '',
            kyc: 1,
          },
          wallet: null,
          servicebuy: null,
        },
      ]

      mockAxios
        .onGet(
          'https://api.qvapay.com/transactions?take=10&user_id=1&start=2023-01-01T00%3A00%3A00.000Z&end=2023-12-31T00%3A00%3A00.000Z&status=paid&remote_id=TEST123&description=Test',
        )
        .reply(200, mockResponse)

      const result = await transactions.search(params)

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get[0].url).toBe(
        '/transactions?take=10&user_id=1&start=2023-01-01T00%3A00%3A00.000Z&end=2023-12-31T00%3A00%3A00.000Z&status=paid&remote_id=TEST123&description=Test',
      )
    })
  })

  describe('getLatest', () => {
    it('should get latest transactions with params', async () => {
      const params: LatestTransactionsParams = {
        start: new Date('2023-01-01'),
        status: 'paid',
        description: 'Test',
      }

      const mockResponse: TransactionsResponse[] = [
        {
          uuid: '2f76f05e-2cda-4042-9e97-3777745d740e',
          app_id: 0,
          amount: '-1',
          description: 'Test transaction',
          remote_id: 'TEST123',
          status: 'paid',
          created_at: new Date('2023-06-15T03:00:47.000Z'),
          updated_at: new Date('2023-06-15T03:01:05.000Z'),
          logo: 'apps/qvapay.jpg',
          app: {
            logo: 'apps/qvapay.jpg',
            url: 'https://qvapay.com',
            name: 'QvaPay',
          },
          paid_by: {
            uuid: '18da6b91-b13e-4ffa-a932-bac1a8b113c3',
            username: 'testuser',
            name: 'Test',
            lastname: 'User',
            bio: '',
            logo: '',
            kyc: 0,
          },
          app_owner: {
            logo: 'apps/qvapay.jpg',
            url: 'https://qvapay.com',
            name: 'QvaPay',
          },
          owner: {
            uuid: '796a9e01-3d67-4a42-9dc2-02a5d069fa23',
            username: 'recipient',
            name: 'Recipient',
            lastname: 'User',
            bio: '',
            logo: '',
            kyc: 1,
          },
          wallet: null,
          servicebuy: null,
        },
      ]

      mockAxios
        .onGet(
          '/transactions?start=2023-01-01T00%3A00%3A00.000Z&status=paid&description=Test',
        )
        .reply(200, mockResponse)

      const result = await transactions.getLatest(params)

      expect(result).toEqual(JSON.parse(JSON.stringify(mockResponse)))
      expect(mockAxios.history.get[0].url).toBe(
        '/transactions?start=2023-01-01T00%3A00%3A00.000Z&status=paid&description=Test',
      )
    })
  })

  describe('getDetails', () => {
    it('should get transaction details', async () => {
      const uuid = '2f76f05e-2cda-4042-9e97-3777745d740e'
      const mockResponse: TransactionsResponse = {
        uuid,
        app_id: 0,
        amount: '-1',
        description: 'Transaction details',
        remote_id: 'DETAILS123',
        status: 'paid',
        created_at: new Date('2023-06-15T03:00:47.000Z'),
        updated_at: new Date('2023-06-15T03:01:05.000Z'),
        logo: 'apps/qvapay.jpg',
        app: {
          logo: 'apps/qvapay.jpg',
          url: 'https://qvapay.com',
          name: 'QvaPay',
        },
        paid_by: {
          uuid: '18da6b91-b13e-4ffa-a932-bac1a8b113c3',
          username: 'testuser',
          name: 'Test',
          lastname: 'User',
          bio: '',
          logo: '',
          kyc: 0,
        },
        app_owner: {
          logo: 'apps/qvapay.jpg',
          url: 'https://qvapay.com',
          name: 'QvaPay',
        },
        owner: {
          uuid: '796a9e01-3d67-4a42-9dc2-02a5d069fa23',
          username: 'recipient',
          name: 'Recipient',
          lastname: 'User',
          bio: '',
          logo: '',
          kyc: 1,
        },
        wallet: null,
        servicebuy: null,
      }

      mockAxios
        .onGet(`/transaction/${uuid}`)
        .reply(200, JSON.parse(JSON.stringify(mockResponse)))

      const result = await transactions.getDetails(uuid)

      // Compare parsed JSON to handle date strings consistently
      expect(JSON.parse(JSON.stringify(result))).toEqual(
        JSON.parse(JSON.stringify(mockResponse)),
      )
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(`/transaction/${uuid}`)
    })
  })

  describe('getWithdrawDetails', () => {
    it('should get withdraw details', async () => {
      const id = 123
      const mockResponse: WithdrawDetailsResponse = {
        id,
        user_id: 1,
        transaction_id: 456,
        amount: '100',
        receive: '95',
        payment_method: 'BTC',
        details: '{"wallet":"bc1q..."}',
        status: 'completed',
        tx_id: null,
        created_at: new Date('2023-06-15T03:00:47.000Z'),
        updated_at: new Date('2023-06-15T03:01:05.000Z'),
        transaction: {
          uuid: '2f76f05e-2cda-4042-9e97-3777745d740e',
          app_id: 0,
          amount: '100',
          description: 'Withdraw',
          remote_id: 'WITHDRAW123',
          status: 'completed',
          created_at: new Date('2023-06-15T03:00:47.000Z'),
          updated_at: new Date('2023-06-15T03:01:05.000Z'),
        },
        coin: {
          id: 1,
          coins_categories_id: 1,
          name: 'Bitcoin',
          logo: 'btc.jpg',
          tick: 'BTC',
          fee_in: '0.0001',
          fee_out: '0.0001',
          min_in: '0.001',
          min_out: '0.001',
          price: '50000',
        },
      }

      mockAxios
        .onGet(`/withdraws/${id}`)
        .reply(200, JSON.parse(JSON.stringify(mockResponse)))

      const result = await transactions.getWithdrawDetails(id)

      expect(JSON.parse(JSON.stringify(result))).toEqual(
        JSON.parse(JSON.stringify(mockResponse)),
      )
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(`/withdraws/${id}`)
    })
  })

  describe('transfer', () => {
    it('should transfer balance', async () => {
      const params = {
        amount: '10',
        to: 'recipient@example.com',
        description: 'Test transfer',
        pin: '1234',
      }

      const mockResponse: TransferResponse = {
        uuid: '2f76f05e-2cda-4042-9e97-3777745d740e',
        app_id: 0,
        amount: 10,
        description: 'Test transfer',
        remote_id: 123,
        status: 'completed',
        updated_at: new Date('2023-06-15T03:00:47.000Z'),
        created_at: new Date('2023-06-15T03:00:47.000Z'),
      }

      mockAxios
        .onPost('/transactions/transfer')
        .reply(200, JSON.parse(JSON.stringify(mockResponse)))

      const result = await transactions.transfer(params)

      expect(JSON.parse(JSON.stringify(result))).toEqual(
        JSON.parse(JSON.stringify(mockResponse)),
      )
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/transactions/transfer')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(params)
    })
  })

  describe('pay', () => {
    it('should pay a transaction', async () => {
      const params = {
        uuid: '2f76f05e-2cda-4042-9e97-3777745d740e',
        pin: '1234',
      }

      const mockResponse: PayTransactionResponse = {
        uuid: params.uuid,
        app_id: 0,
        amount: '10',
        description: 'Payment completed',
        remote_id: 'PAYMENT123',
        status: 'paid',
        created_at: new Date('2023-06-15T03:00:47.000Z'),
        updated_at: new Date('2023-06-15T03:01:05.000Z'),
        owner: {
          uuid: '796a9e01-3d67-4a42-9dc2-02a5d069fa23',
          username: 'recipient',
          name: 'Recipient',
          lastname: 'User',
          bio: '',
          logo: '',
          kyc: 1,
        },
      }

      mockAxios
        .onPost('/transactions/pay')
        .reply(200, JSON.parse(JSON.stringify(mockResponse)))

      const result = await transactions.pay(params)

      expect(JSON.parse(JSON.stringify(result))).toEqual(
        JSON.parse(JSON.stringify(mockResponse)),
      )
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/transactions/pay')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(params)
    })
  })
})
