// src/core/errors.ts
import axios, { type AxiosError } from 'axios'

export class QvaPayError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly data?: unknown,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'QvaPayError'
    Object.setPrototypeOf(this, QvaPayError.prototype)
  }
}

export class TwoFactorRequiredError extends Error {
  readonly code = 'TWO_FACTOR_REQUIRED'
  constructor(public readonly info: string) {
    super(info)
    this.name = 'TwoFactorRequiredError'
    Object.setPrototypeOf(this, TwoFactorRequiredError.prototype)
  }
}

function getErrorMessageFromResponse(
  data: unknown,
  fallbackMessage: string,
): string {
  if (data && typeof data === 'object') {
    return (
      (data as { error?: string }).error ||
      (data as { message?: string }).message ||
      fallbackMessage
    )
  }
  return String(data ?? fallbackMessage)
}

export function handleApiError(error: unknown, debug = false): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    const responseData = axiosError.response?.data
    const message = getErrorMessageFromResponse(
      responseData,
      axiosError.message || 'API error',
    )
    const statusCode = axiosError.response?.status
    const errorCode = (responseData as { code?: string })?.code

    if (debug) {
      console.error('[QvaPay Error]', {
        message,
        statusCode,
        code: errorCode,
        url: axiosError.config?.url,
        method: axiosError.config?.method?.toUpperCase(),
        requestData: axiosError.config?.data,
        responseData,
        stack: axiosError.stack,
      })
    }

    if (errorCode === 'TWO_FACTOR_REQUIRED') {
      throw new TwoFactorRequiredError(message)
    }

    throw new QvaPayError(message, statusCode, responseData, errorCode)
  }

  const genericError = error instanceof Error ? error : new Error(String(error))
  if (debug) {
    console.error('[QvaPay Unhandled Error]', {
      message: genericError.message,
      stack: genericError.stack,
    })
  }
  throw genericError
}
