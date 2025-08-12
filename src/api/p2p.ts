import type { QvaPayClient } from '../core/client'
import type { EnabledCurrencies } from '../core/constants'
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
} from '../interfaces'

export class P2P {
  constructor(private readonly client: QvaPayClient) {}

  /**
   * Get P2P API status welcome message
   */
  async getWelcomeMessage(): Promise<{ message: string }> {
    return await this.client.request({
      method: 'GET',
      url: '/p2p',
    })
  }

  /**
   * Get weekly average exchange rates for P2P trades
   */
  async getWeeklyAverage(): Promise<P2PAverageResponse> {
    return await this.client.request<P2PAverageResponse>({
      method: 'GET',
      url: '/p2p/average',
    })
  }

  /**
   * Get real-time averages of completed trading pairs
   * @params currency - Optional currency filter (e.g. 'BANK_CUP', 'USDT')
   */
  async getCompletedPairsAverages(
    params?: EnabledCurrencies,
  ): Promise<CompletedTradingPairsAverageResponse> {
    const queryString = params ? `?coins=${params}` : ''

    return await this.client.request({
      method: 'GET',
      url: `/p2p/completed_pairs_average${queryString}`,
    })
  }

  /**
   * Get counts of currently open public operations
   */
  async getPublicOperationsCount(): Promise<{ buy: number; sell: number }> {
    return await this.client.request<{ buy: number; sell: number }>({
      method: 'GET',
      url: '/p2p/get_total_operations',
    })
  }

  /**
   * Get available P2P offers with optional filters
   *
   * @param params - Filtering options:
   *   - type: 'buy' or 'sell'
   *   - min: Minimum amount
   *   - max: Maximum amount
   *   - coin: Currency filter
   *   - my: Show only your offers
   *   - vip: Show VIP offers only
   *
   * @returns Paginated list of P2P offers
   *
   * @note Data freshness depends on user level:
   * - Guest: 8 minutes delay
   * - Non-KYC: 5 minutes delay
   * - KYC: 2 minutes delay
   * - GOLD: Real-time
   * - VIP: Real-time
   */
  async getOffers(params?: GetOfferParams): Promise<P2POffersResponse> {
    const queryParams = new URLSearchParams()

    if (params) {
      if (params.type) queryParams.append('type', params.type)
      if (params.min !== undefined)
        queryParams.append('min', params.min.toString())
      if (params.max !== undefined)
        queryParams.append('max', params.max.toString())
      if (params.coin) queryParams.append('coin', params.coin)
      if (params.my) queryParams.append('my', 'true')
      if (params.vip) queryParams.append('vip', 'true')
    }

    const url = `/p2p/index${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    return await this.client.request({
      method: 'GET',
      url,
    })
  }

  async getMyOffers(
    params?: Omit<GetOfferParams, 'my'>,
  ): Promise<P2POffersResponse> {
    const queryParams = new URLSearchParams()

    if (params) {
      if (params.type) queryParams.append('type', params.type)
      if (params.min !== undefined)
        queryParams.append('min', params.min.toString())
      if (params.max !== undefined)
        queryParams.append('max', params.max.toString())
      if (params.coin) queryParams.append('coin', params.coin)
      if (params.vip) queryParams.append('vip', 'true')
    }

    return await this.client.request<P2POffersResponse>({
      method: 'GET',
      url: `/p2p/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    })
  }

  /**
   * Get details about a specific P2P offer
   */
  async getOfferDetail(offerId: string): Promise<P2POfferDetails> {
    return await this.client.request<P2POfferDetails>({
      method: 'GET',
      url: `/p2p/${offerId}`,
    })
  }

  /**
   * FIX: Get chat for a specific P2P offer
   * @param offerId - The UUID of the offer
   * @returns Chat messages and metadata (response structure to be confirmed)
   *
   * @note The offer must be either:
   *   - In 'open' status, OR
   *   - You must be a peer in this offer
   */
  async getOfferChat(offerId: string): Promise<P2PChatResponse> {
    return await this.client.request<P2PChatResponse>({
      method: 'GET',
      url: `/p2p/${offerId}/chat`,
    })
  }

  /**
   * Create a new P2P offer
   * @param params - Offer creation parameters:
   *   - type: 'buy' or 'sell'
   *   - coin: Currency ID or ticker
   *   - amount: Offer amount
   *   - receive: Amount to receive
   *   - details: Payment details (array or stringified JSON)
   *   - only_kyc: Restrict to KYC-verified users
   *   - private: Make offer private
   *   - promote_offer: Promote the offer
   *   - only_vip: Restrict to VIP users
   *
   * @returns The created offer details
   *
   * @example
   * await createOffer({
   *   type: 'buy',
   *   coin: 'BANK',
   *   amount: 10,
   *   receive: 11,
   *   details: [
   *     { name: 'Bank Name', type: 'text', value: 'My Bank' },
   *     { name: 'Account', type: 'text', value: '123456' }
   *   ],
   *   only_kyc: true
   * })
   */
  async createOffer(
    params: CreateP2POfferParams,
  ): Promise<CreateP2POfferResponse> {
    const requestParams = {
      ...params,
      details: Array.isArray(params.details)
        ? JSON.stringify(params.details)
        : params.details,
      only_kyc: params.only_kyc ? 1 : 0,
      private: params.private ? 1 : 0,
      promote_offer: params.promote_offer ? 1 : 0,
      only_vip: params.only_vip ? 1 : 0,
    }

    return await this.client.request<CreateP2POfferResponse>({
      method: 'POST',
      url: '/p2p/create',
      data: requestParams,
    })
  }

  /**
   * Apply to a P2P offer
   * @param offerId - UUID of the offer to apply to
   * @returns Confirmation and updated offer details
   */
  async applyToOffer(offerId: string): Promise<ApplyToOfferResponse> {
    return await this.client.request({
      method: 'POST',
      url: `/p2p/${offerId}/apply`,
    })
  }

  /**
   * Cancel a P2P offer
   * @param offerId - UUID of the offer to cancel
   */
  async cancelOffer(offerId: string): Promise<void> {
    await this.client.request({
      method: 'POST',
      url: `/p2p/${offerId}/cancel`,
    })
  }

  /**
   * Send message to P2P offer peer
   * @param offerId - UUID of the offer
   * @param text - Message content
   * @returns Updated offer details
   */
  async sendMessage(
    offerId: string,
    text: string,
  ): Promise<ApplyToOfferResponse> {
    return await this.client.request({
      method: 'POST',
      url: `/p2p/${offerId}/chat`,
      data: { text },
    })
  }
}
