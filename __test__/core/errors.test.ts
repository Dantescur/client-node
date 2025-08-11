import { describe, expect, it } from 'vitest'
import {
  handleApiError,
  QvaPayError,
  TwoFactorRequiredError,
} from '../../src/core/errors'

describe('Error Classes', () => {
  it('should create a QvaPayError instance', () => {
    const error = new QvaPayError('Test error', 400, { detail: 'test' })

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('QvaPayError')
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(400)
    expect(error.data).toEqual({ detail: 'test' })
  })

  it('should create a TwoFactorRequiredError instance', () => {
    const error = new TwoFactorRequiredError('2FA required')

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('TwoFactorRequiredError')
    expect(error.message).toBe('2FA required')
    expect(error.code).toBe('TWO_FACTOR_REQUIRED')
    expect(error.info).toBe('2FA required')
  })
})

describe('handleApiError', () => {
  it('should handle Axios errors with response data containing error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          error: 'Invalid token',
          message: 'Authentication failed',
        },
      },
      message: 'Request failed',
    }

    expect(() => handleApiError(axiosError)).toThrowError('Invalid token')
  })

  it('should handle Axios errors with response data containing message', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          message: 'Authentication failed',
        },
      },
      message: 'Request failed',
    }

    expect(() => handleApiError(axiosError)).toThrowError(
      'Authentication failed',
    )
  })

  it('should handle Axios errors with response data but no error or message', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: {
          someOtherField: 'value',
        },
      },
      message: 'Request failed',
    }

    expect(() => handleApiError(axiosError)).toThrowError('API error')
  })

  it('should handle Axios errors with string response data', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: 'Simple error message',
      },
      message: 'Request failed',
    }

    expect(() => handleApiError(axiosError)).toThrowError(
      'Simple error message',
    )
  })

  it('should handle Axios errors with no response data', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: null,
      },
      message: 'Request failed',
    }

    expect(() => handleApiError(axiosError)).toThrowError('Request failed')
  })

  it('should handle non-Axios errors', () => {
    const regularError = new Error('Regular error')

    expect(() => handleApiError(regularError)).toThrowError('Regular error')
  })
})
