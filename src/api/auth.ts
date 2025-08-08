import { qvapayAPI } from '../helpers/axios'
import type { Login, LoginResponse, Register } from '../interfaces'
import type { AxiosError, AxiosResponse } from 'axios'

export const login = async (loginData: Login): Promise<LoginResponse> => {
  try {
    const { data } = await qvapayAPI.post('/auth/login', loginData)
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

export const register = async (registerData: Register): Promise<any> => {
  try {
    const { data } = await qvapayAPI.post('/auth/register', registerData)
    return data
  } catch (error) {
    const { response } = error as AxiosError
    const { data } = response as AxiosResponse
    return data
  }
}

//* accessToken es el token que retorna la función login
export const logout = async (
  accessToken: string,
): Promise<{ message: string }> => {
  try {
    const { data } = await qvapayAPI.get('/auth/logout', {
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
