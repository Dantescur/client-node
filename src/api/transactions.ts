import { qvapayAPI } from '../core/client'
import type {
  PayResponse,
  TransactionBetweenUser,
  TransactionPay,
  TransactionProps,
  TransactionResponse,
  WithdrawResponse,
} from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const getTransactionsFromUserAuth = async (
  accessToken: string,
  props: TransactionProps,
): Promise<TransactionResponse[]> => {
  try {
    const objectEntries = Object.entries(props)
    const params = new URLSearchParams(objectEntries)
    const { data } = await qvapayAPI.get('/transactions', {
      params,
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

export const getOneTransaction = async (
  accessToken: string,
  id: string,
): Promise<TransactionResponse> => {
  try {
    const { data } = await qvapayAPI.get(`/transactions/${id}`, {
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

export const getWithdrawsFromUserAuth = async (
  accessToken: string,
): Promise<WithdrawResponse> => {
  try {
    const { data } = await qvapayAPI.get('/withdraws', {
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

export const getOneWithdraw = async (
  accessToken: string,
  id: string,
): Promise<any> => {
  try {
    const { data } = await qvapayAPI.get(`/withdraws/${id}`, {
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

export const transferBetweenUser = async (
  accessToken: string,
  transfer: TransactionBetweenUser,
): Promise<any> => {
  try {
    const { data } = await qvapayAPI.post('/transactions/transfer', transfer, {
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

/**
 * @Params
 * Proceder al pago de determinada transacción "pending".
Se requiere el uuid de la transacción a pagar así como el PIN del usuario que está pagando la misma. El PIN por defecto es 0000, es altamente recomendable configurar un PIN de forma secreta en el panel de usuario.
 */
export const payPendingTransaction = async (
  accessToken: string,
  pay: TransactionPay,
): Promise<PayResponse> => {
  try {
    const { data } = await qvapayAPI.post('/transactions/pay', pay, {
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
