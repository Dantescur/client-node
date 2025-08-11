import { qvapayAPI } from '../core/client'
import type {
  AppAuth,
  AppInfo,
  AppOneTransactionResponse,
  AppTransaction,
  Invoice,
  InvoiceResponse,
} from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const appInfo = async (auth: AppAuth): Promise<AppInfo> => {
  try {
    const { data } = await qvapayAPI.post('/v1/info', auth)
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const appBalance = async (auth: AppAuth): Promise<number> => {
  try {
    const { data } = await qvapayAPI.post('/v1/balance', auth)
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const createInvoice = async (
  invoice: Invoice,
): Promise<InvoiceResponse> => {
  try {
    const { data } = await qvapayAPI.post('/v1/create_invoice', invoice)
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const getTransactionsFromApp = async (
  auth: AppAuth,
): Promise<AppTransaction> => {
  try {
    const { data } = await qvapayAPI.post('/v1/transactions', auth)
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const getOneTransactionFromApp = async (
  auth: AppAuth,
  id: string,
): Promise<AppOneTransactionResponse> => {
  try {
    const { data } = await qvapayAPI.post(`/v1/transactions/${id}`, auth)
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}
