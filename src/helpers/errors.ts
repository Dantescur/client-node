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

export class TwoFactorRequiredError extends Error {
  readonly code = 'TWO_FACTOR_REQUIRED'
  constructor(public readonly info: string) {
    super(info)
    this.name = 'TwoFactorRequiredError'
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
