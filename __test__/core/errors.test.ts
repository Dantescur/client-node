import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  handleApiError,
  QvaPayError,
  TwoFactorRequiredError,
} from '../../src/core/errors'

describe('Error Classes', () => {
  it('should create a QvaPayError instance', () => {
    const error = new QvaPayError(
      'Test error',
      400,
      { detail: 'test' },
      'INVALID_REQUEST',
    )

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('QvaPayError')
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(400)
    expect(error.data).toEqual({ detail: 'test' })
    expect(error.code).toBe('INVALID_REQUEST')
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
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle Axios errors with response data containing error', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          error: 'Invalid token',
          message: 'Authentication failed',
          code: 'AUTH_FAILED',
        },
      },
      config: {
        url: '/auth',
        method: 'post',
        data: { token: 'invalid' },
      },
      message: 'Request failed',
      stack: 'Error stack',
    }

    expect(() => handleApiError(axiosError, true)).toThrow(QvaPayError)
    expect(console.error).toHaveBeenCalledWith(
      '[QvaPay Error]',
      expect.objectContaining({
        message: 'Invalid token',
        statusCode: 401,
        code: 'AUTH_FAILED',
      }),
    )
  })

  it('should handle Axios errors with response data containing message', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 403,
        data: {
          message: 'Access denied',
        },
      },
      message: 'Request failed',
    }

    expect(() => handleApiError(axiosError)).toThrow(QvaPayError)
    const error = getThrownError(() => handleApiError(axiosError))
    expect(error.message).toBe('Access denied')
    // @ts-expect-error: casting XD
    expect(error.statusCode).toBe(403)
  })

  it('should handle 2FA required errors', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 403,
        data: {
          error: '2FA required',
          code: 'TWO_FACTOR_REQUIRED',
        },
      },
      message: 'Request failed',
    }

    expect(() => handleApiError(axiosError)).toThrow(TwoFactorRequiredError)
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

  it('should handle Axios errors with no response data and no message', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: null,
      },
      message: '',
    }

    expect(() => handleApiError(axiosError)).toThrowError('API error')
  })

  it('should handle non-Axios errors', () => {
    const regularError = new Error('Regular error')

    expect(() => handleApiError(regularError, true)).toThrowError(
      'Regular error',
    )
    expect(console.error).toHaveBeenCalledWith(
      '[QvaPay Unhandled Error]',
      expect.objectContaining({
        message: 'Regular error',
      }),
    )
  })

  it('should handle non-Error thrown values', () => {
    expect(() => handleApiError('Just a string')).toThrowError('Just a string')
  })
})

// Helper function to get thrown error
function getThrownError(fn: () => void): Error {
  try {
    fn()
    throw new Error('Function did not throw')
  } catch (error) {
    return error as Error
  }
}
