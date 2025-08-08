import axios, { type AxiosInstance } from 'axios'

const qvapayAPI: AxiosInstance = axios.create({
  baseURL: 'https://qvapay.com/api',
  headers: {
    Accept: 'application/json',
  },
})

export { qvapayAPI }
