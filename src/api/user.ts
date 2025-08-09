import type { QvaPayClient } from '../helpers/axios'
import type {
  GoldPurchaseResponse,
  Me,
  MeExtendedResponse,
  TopUpParams,
  TopUpResponse,
  UpdateUserParams,
  UpdateUserResponse,
  UserSearchResult,
  WithdrawRequest,
  WithdrawResponse,
} from '../interfaces'
import type { Buffer } from 'node:buffer'

export class User {
  constructor(private readonly client: QvaPayClient) {}

  /**
   * Fetches information about the authenticated user.
   * @returns User information including ID, email, and creation date.
   */
  async getMe(): Promise<Me> {
    return await this.client.request<Me>({
      method: 'GET',
      url: '/user',
    })
  }

  /**
   *  Fetches extended information about the authenticated user.
   * @returns Extended user information including KYC status and other details.
   */
  async getMeExtended(): Promise<MeExtendedResponse> {
    return await this.client.request<MeExtendedResponse>({
      method: 'GET',
      url: '/user/extended',
    })
  }

  // FIXME: Define a proper interface for the response
  async getMeKycStatus(): Promise<any> {
    return await this.client.request<any>({
      method: 'GET',
      url: '/user/kyc',
    })
  }

  /**
   * Upload KYC document
   * @param file - File buffer
   * @param filename - Document filename
   */
  async uploadKycDocument(file: Buffer, filename: string): Promise<any> {
    const formData = new FormData()

    formData.append('document', file, filename)

    return await this.client.request<any>({
      method: 'POST',
      url: '/user/kyc',
      data: formData,
    })
  }

  /**
   * Updates the authenticated user's information.
   * @param params - Parameters to update user information.
   * @returns Updated user information.
   */
  async updateMe(params?: UpdateUserParams): Promise<UpdateUserResponse> {
    return await this.client.request<UpdateUserResponse>({
      method: 'PUT',
      url: '/user/update',
      data: params,
    })
  }

  /**
   * Update user email with PIN verification
   * @param newEmail - New email address to set
   * @param pin - PIN code for verification or empty for requesting a new PIN
   */
  async updateEmail(
    newEmail: string,
    pin: string = '',
  ): Promise<{ success: boolean; message?: string }> {
    return await this.client.request<{
      success: boolean
      message?: string
    }>({
      method: 'PUT',
      url: '/user/update/email',
      data: { email: newEmail, pin },
    })
  }

  /**
   * Update user name
   * @param newUsername - New username to set
   * @returns Updated user information.
   */
  async updateUsername(newUsername: string): Promise<any> {
    // FIXME: Define a proper interface for the response
    return await this.client.request<any>({
      method: 'PUT',
      url: '/user/update/username',
      data: { username: newUsername },
    })
  }

  /**
   * Update user avatar
   * @param file - File buffer
   * @param filename - Avatar filename
   */
  async updateAvatar(file: Buffer, filename: string): Promise<any> {
    const formData = new FormData()

    formData.append('avatar', file, filename)
    // FIXME: Define a proper interface for the response
    return await this.client.request<any>({
      method: 'PUT',
      url: '/user/update/avatar',
      data: formData,
    })
  }

  /**
   * TopUp balance
   * @params pay_method - Payment method
   * @params amount - Amount to top up
   * @params webhook_url - Optional webhook URL for payment notifications
   */
  async topUpBalance(params: TopUpParams): Promise<TopUpResponse> {
    return await this.client.request<TopUpResponse>({
      method: 'POST',
      url: '/topup',
      data: params,
    })
  }

  /**
   * Withdraw funds from account
   * @param request Withdrawal details
   */
  async withdraw(request: WithdrawRequest): Promise<WithdrawResponse> {
    return await this.client.request<WithdrawResponse>({
      method: 'POST',
      url: '/withdraw',
      data: request,
    })
  }

  /**
   * Purchase Gold status
   * @param csrf - CSRF token for security
   */
  async buyGold(csrf: string): Promise<GoldPurchaseResponse> {
    return await this.client.request<GoldPurchaseResponse>({
      method: 'POST',
      url: '/gold',
      data: { csrf },
    })
  }

  /**
   * Search for users
   * @param query Search term (username, name, etc.)
   * @returns Array of matching users
   */
  async search(query: string): Promise<UserSearchResult> {
    return await this.client.request<UserSearchResult>({
      method: 'POST',
      url: '/user/search',
      data: { query },
    })
  }
}
