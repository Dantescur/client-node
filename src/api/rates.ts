import { qvapayAPI } from '../helpers/axios'
import type { CurrentRates } from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const currentRates = async (): Promise<CurrentRates[]> => {
  try {
    const { data } = await qvapayAPI.get('/rates/index')
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const currentCoins = async (): Promise<CurrentRates[]> => {
  try {
    const { data } = await qvapayAPI.get('/coins')
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}
