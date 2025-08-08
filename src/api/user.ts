import { qvapayAPI } from '../helpers/axios'

import type {
  Deposit,
  Me,
  Transaction,
  UpdateUser,
  User,
  Withdraw,
} from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const getUser = async (accessToken: string): Promise<User> => {
  try {
    const { data } = await qvapayAPI.get('/user', {
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

export const updateUser = async (
  accessToken: string,
  dataToUpdate: UpdateUser,
): Promise<Me> => {
  try {
    const { data } = await qvapayAPI.put('/user', dataToUpdate, {
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

export const deposit = async (
  accessToken: string,
  newDeposit: Deposit,
): Promise<Transaction> => {
  try {
    const { data } = await qvapayAPI.post('/topup', newDeposit, {
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

export const withdraw = async (
  accessToken: string,
  newWithdraw: Withdraw,
): Promise<any> => {
  try {
    const { data } = await qvapayAPI.post('/withdraw', newWithdraw, {
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
