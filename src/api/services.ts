import { qvapayAPI } from '../core/client'
import type { Service, ServiceResponse } from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const getAllServices = async (
  accessToken: string,
): Promise<ServiceResponse> => {
  try {
    const { data } = await qvapayAPI.get('/services', {
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

export const getOneService = async (
  accessToken: string,
  id: string,
): Promise<Service> => {
  try {
    const { data } = await qvapayAPI.get(`/services/${id}`, {
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
