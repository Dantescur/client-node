import type { QvaPayClient } from '../core/client'
import type {
  CreatePaymentLinkParams,
  PaymentLinkResponse,
} from '../interfaces'

export class PaymentLink {
  constructor(private readonly client: QvaPayClient) {}

  /**
   * Get all payment links for the authenticated account
   * @returns Promise<PaymentLinkResponse[]> - Array of payment links
   */
  async getAll(): Promise<PaymentLinkResponse[]> {
    return await this.client.request<PaymentLinkResponse[]>({
      method: 'GET',
      url: '/payment_links',
    })
  }

  /**
   * Create a new payment link
   * @param params {@link CreatePaymentLinkParams} - Payment link details
   * @returns Promise<PaymentLinkResponse> - Created payment link
   */
  async create(params: CreatePaymentLinkParams): Promise<PaymentLinkResponse> {
    return await this.client.request<PaymentLinkResponse>({
      method: 'POST',
      url: '/payment_links/create',
      data: params,
    })
  }
}
