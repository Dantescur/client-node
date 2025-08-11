import { qvapayAPI } from '../core/client'
import type { PaymentLink, PaymentLinkResponse } from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const getAllPaymentLinks = async (
  accessToken: string,
): Promise<PaymentLinkResponse[]> => {
  try {
    const { data } = await qvapayAPI.get('/payment_links', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const createPaymentLink = async (
  accessToken: string,
  info: PaymentLink,
): Promise<PaymentLinkResponse> => {
  try {
    const { data } = await qvapayAPI.post('/payment_links/create', info, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}
