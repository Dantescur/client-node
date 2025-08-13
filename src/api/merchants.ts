import type { QvaPayClient } from '../core/client'
import type {
  AppInfoResponse,
  AppParams,
  AppTransactionsParams,
  AppTransactionsResponse,
  AuthorizePaymentsParams,
  AuthorizePaymentsResponse,
  ChargeUserParams,
  ChargeUserResponse,
  CreateInvoiceParams,
  CreateInvoiceResponse,
  TransactionStatusParams,
  TransactionStatusResponse,
} from '../interfaces'

export class Merchants {
  constructor(private readonly client: QvaPayClient) {}

  /**
   * Get information about an APP
   * @params {@link AppParams} - app_id and app_secret for the app
   * @returns Info about an app
   */
  async appInfo(params: AppParams): Promise<AppInfoResponse> {
    return await this.client.request<AppInfoResponse>({
      method: 'POST',
      url: '/v2/info',
      data: params,
    })
  }

  /**
   * Get the balance of the owner account of this App
   * @params {@link AppParams} - app_id and app_secret for the app
   * @returns The balance of the account
   */
  async checkBalance(params: AppParams): Promise<string> {
    return await this.client.request<string>({
      method: 'POST',
      url: '/v2/balance',
      data: params,
    })
  }

  /**
   * Create a payment invoice
   * @param params {@link CreateInvoiceParams} - Invoice creation parameters
   * @returns {@link CreateInvoiceResponse} - Invoice details including payment URL
   */
  async createInvoice(
    params: CreateInvoiceParams,
  ): Promise<CreateInvoiceResponse> {
    return await this.client.request<CreateInvoiceResponse>({
      method: 'POST',
      url: '/v2/create_invoice',
      data: params,
    })
  }

  /**
   * Charge an authorized user
   * @param params {@link ChargeUserParams} - Charge parameters including user UUID
   * @returns {@link ChargeUserResponse} - Transaction details
   */
  async chargeUser(params: ChargeUserParams): Promise<ChargeUserResponse> {
    return await this.client.request<ChargeUserResponse>({
      method: 'POST',
      url: '/v2/charge',
      data: params,
    })
  }

  /**
   * Get a temporary URL to authorize payments from QvaPay users
   * @param params {@link AuthorizePaymentsParams} - Authorization parameters
   * @returns {@link AuthorizePaymentsResponse} - Authorization URL
   */
  async authorizePayments(
    params: AuthorizePaymentsParams,
  ): Promise<AuthorizePaymentsResponse> {
    return await this.client.request<AuthorizePaymentsResponse>({
      method: 'POST',
      url: '/v2/authorize_payments',
      data: params,
    })
  }

  /**
   * Check the status of a specific transaction
   * @param transactionId - The UUID of the transaction to check
   * @param params {@link TransactionStatusParams} - App credentials
   * @returns {@link TransactionStatusResponse} - Transaction status details
   */
  async getTransactionStatus(
    transactionId: string,
    params: TransactionStatusParams,
  ): Promise<TransactionStatusResponse> {
    return await this.client.request<TransactionStatusResponse>({
      method: 'POST',
      url: `/v2/transactions/${transactionId}`,
      data: params,
    })
  }

  /**
   * Get all transactions for the current app
   * @param params {@link AppTransactionsParams} - App credentials
   * @returns {@link AppTransactionsResponse} - List of transactions
   */
  async getAppTransactions(
    params: AppTransactionsParams,
  ): Promise<AppTransactionsResponse> {
    return await this.client.request<AppTransactionsResponse>({
      method: 'POST',
      url: '/v2/transactions',
      data: params,
    })
  }
}
