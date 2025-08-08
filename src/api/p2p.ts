import { qvapayAPI } from '../helpers/axios'
import type {
  Offer,
  OffersParams,
  OffersResponse,
  PairsAverageResponse,
} from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const getEnabledCurrencies = async (): Promise<string[]> => {
  try {
    const { data } = await qvapayAPI.get('/p2p/get_coins_list')
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const getPairsAverage = async (
  coin: string,
): Promise<PairsAverageResponse> => {
  try {
    const { data } = await qvapayAPI.get(
      `/p2p/completed_pairs_average?coin=${coin.toUpperCase()}`,
    )
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const getOffers = async (
  accessToken: string,
  props: OffersParams,
): Promise<OffersResponse> => {
  try {
    const objectEntries = Object.entries(props)
    const params = new URLSearchParams(objectEntries)
    const { data } = await qvapayAPI.get('/p2p/index', {
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

export const getOneOffer = async (
  accessToken: string,
  id: string,
): Promise<Offer> => {
  try {
    const { data } = await qvapayAPI.get(`/p2p/${id}`, {
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
