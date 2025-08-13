import { Buffer } from 'node:buffer'
import type { QvaPayClient } from '../core/client'
import type {
  LatestTransactionsParams,
  PayTransactionParams,
  PayTransactionResponse,
  SearchTransactionsParams,
  TransactionPDFParams,
  TransactionsDetailsParams,
  TransactionsResponse,
  TransferParams,
  TransferResponse,
  WithdrawDetailsResponse,
  WithdrawResponse,
} from '../interfaces'
import type { AxiosResponse } from 'axios'

export class Transactions {
  constructor(private readonly client: QvaPayClient) {}

  /**
   * Search transactions with filters
   * @param params - Search parameters including pagination and filters
   * @returns Array of transactions matching the criteria
   */
  async search(
    params?: SearchTransactionsParams,
  ): Promise<TransactionsResponse[]> {
    const queryParams = new URLSearchParams()

    if (params) {
      if (params.take !== undefined)
        queryParams.append('take', params.take.toString())
      if (params.user_id !== undefined)
        queryParams.append('user_id', params.user_id.toString())
      if (params.start) queryParams.append('start', params.start.toISOString())
      if (params.end) queryParams.append('end', params.end.toISOString())
      if (params.status) queryParams.append('status', params.status)
      if (params.remote_id) queryParams.append('remote_id', params.remote_id)
      if (params.description)
        queryParams.append('description', params.description)
    }

    const url = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    return await this.client.request<TransactionsResponse[]>({
      method: 'GET',
      url,
    })
  }

  /**
   * Get latest transactions for the authenticated user
   * @param params - Optional filters (excluding pagination and user_id)
   * @returns Array of latest transactions
   */
  async getLatest(
    params?: LatestTransactionsParams,
  ): Promise<TransactionsResponse[]> {
    const queryParams = new URLSearchParams()

    if (params) {
      if (params.start) queryParams.append('start', params.start.toISOString())
      if (params.end) queryParams.append('end', params.end.toISOString())
      if (params.status) queryParams.append('status', params.status)
      if (params.remote_id) queryParams.append('remote_id', params.remote_id)
      if (params.description)
        queryParams.append('description', params.description)
    }

    const url = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    return await this.client.request<TransactionsResponse[]>({
      method: 'GET',
      url,
    })
  }

  /**
   * Get transaction details by UUID
   * @param uuid - Transaction UUID
   * @param params - Optional filters for the transaction details
   * @returns Transaction details
   */
  async getDetails(
    uuid: string,
    params?: TransactionsDetailsParams,
  ): Promise<TransactionsResponse> {
    const queryParams = new URLSearchParams()

    if (params) {
      if (params.start) queryParams.append('start', params.start.toISOString())
      if (params.end) queryParams.append('end', params.end.toISOString())
      if (params.status) queryParams.append('status', params.status)
      if (params.remote_id) queryParams.append('remote_id', params.remote_id)
      if (params.description)
        queryParams.append('description', params.description)
    }

    const url = `/transaction/${uuid}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    return await this.client.request<TransactionsResponse>({
      method: 'GET',
      url,
    })
  }

  /**
   * Get transaction PDF by UUID
   * @param uuid - Transaction UUID
   * @param params - Optional filters for the PDF
   * @returns PDF data as Buffer
   */
  async getPDF(uuid: string, params?: TransactionPDFParams): Promise<Buffer> {
    const queryParams = new URLSearchParams()

    if (params) {
      if (params.start) queryParams.append('start', params.start.toISOString())
      if (params.end) queryParams.append('end', params.end.toISOString())
      if (params.status) queryParams.append('status', params.status)
      if (params.remote_id) queryParams.append('remote_id', params.remote_id)
      if (params.description)
        queryParams.append('description', params.description)
    }

    const url = `/transaction/${uuid}/pdf${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    const response: AxiosResponse<Buffer> = await this.client.request({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
    })

    return Buffer.from(response.data)
  }

  /**
   * Get last 10 withdraw operations for authenticated user
   * @returns Paginated list of withdraw operations
   */
  async getWithdraws(): Promise<WithdrawResponse> {
    return await this.client.request<WithdrawResponse>({
      method: 'GET',
      url: '/withdraws',
    })
  }

  /**
   * Get withdraw details by ID
   * @param id - Withdraw operation ID
   * @returns Detailed withdraw information
   */
  async getWithdrawDetails(id: number): Promise<WithdrawDetailsResponse> {
    return await this.client.request<WithdrawDetailsResponse>({
      method: 'GET',
      url: `/withdraws/${id}`,
    })
  }

  /**
   * Transfer balance between users
   * @param params - Transfer parameters including amount, recipient, and optional description/pin
   * @returns Transfer confirmation response
   */
  async transfer(params: TransferParams): Promise<TransferResponse> {
    return await this.client.request<TransferResponse>({
      method: 'POST',
      url: '/transactions/transfer',
      data: params,
    })
  }

  /**
   * Pay a pending transaction
   * @param params - Payment parameters including transaction UUID and PIN
   * @returns Payment confirmation response
   */
  async pay(params: PayTransactionParams): Promise<PayTransactionResponse> {
    return await this.client.request<PayTransactionResponse>({
      method: 'POST',
      url: '/transactions/pay',
      data: params,
    })
  }
}
