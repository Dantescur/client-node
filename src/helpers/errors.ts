import axios from 'axios'

export class QvaPayError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly data?: unknown,
  ) {
    super(message)
    this.name = 'QvaPayError'
  }
}

export function handleApiError(error: any): never {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data === 'object'
        ? error.response.data.error ||
          error.response.data.message ||
          'API error'
        : String(error.response?.data || error.message)

    throw new Error(message)
  }
  throw error
}
