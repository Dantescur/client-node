import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QvaPayClient } from '../../src/core/client.ts'
import { handleApiError } from '../../src/core/errors.ts'

vi.mock('../../src/core/errors.ts', () => ({
  handleApiError: vi.fn(),
}))

describe('QvaPayClient', () => {
  let client: QvaPayClient
  let mockAxios: MockAdapter

  beforeEach(() => {
    client = new QvaPayClient({ baseUrl: 'https://api.qvapay.com' })
    /// @ts-expect-error access to private private property
    mockAxios = new MockAdapter(client.instance)
  })

  afterEach(() => {
    mockAxios.restore()
    vi.clearAllMocks()
  })

  it('initializes with default base URL and headers', () => {
    const defaultClient = new QvaPayClient()

    /// @ts-expect-error access to private private property
    expect(defaultClient.instance.defaults.baseURL).toBe(
      'https://api.qvapay.com',
    )

    /// @ts-expect-error access to private private property
    expect(defaultClient.instance.defaults.headers.Accept).toBe(
      'application/json',
    )
  })

  it('initializes with authToken in constructor', async () => {
    const authToken = 'constructor-token'
    const clientWithToken = new QvaPayClient({
      baseUrl: 'https://api.qvapay.com',
      authToken,
    })

    // @ts-expect-error access to private property
    expect(clientWithToken.authToken).toBe(authToken)

    // Create a new MockAdapter for clientWithToken's Axios instance
    // @ts-expect-error access to private property
    const mockAxiosForClient = new MockAdapter(clientWithToken.instance)
    mockAxiosForClient.onGet('/test').reply(200, { success: true })

    await clientWithToken.request({ url: '/test', method: 'GET' })

    const request = mockAxiosForClient.history.get[0]
    expect(request.headers?.Authorization).toBe(`Bearer ${authToken}`)

    // Clean up the mock
    mockAxiosForClient.restore()
  })

  it('sets auth token and injects it into requests', async () => {
    client.setAuthToken('test-token')
    mockAxios.onGet('/test').reply(200, { success: true })

    await client.request({ url: '/test', method: 'GET' })

    const request = mockAxios.history.get[0]
    expect(request.headers?.Authorization).toBe('Bearer test-token')
  })

  it('clears auth token and removes it from requests', async () => {
    // Set token initially
    client.setAuthToken('test-token')
    mockAxios.onGet('/test').reply(200, { success: true })

    // Make a request with token
    await client.request({ url: '/test', method: 'GET' })
    expect(mockAxios.history.get[0].headers?.Authorization).toBe(
      'Bearer test-token',
    )

    // Clear token
    client.clearAuthToken()

    // @ts-expect-error access to private property
    expect(client.authToken).toBeUndefined()

    // Make another request
    mockAxios.resetHistory() // Clear request history
    await client.request({ url: '/test', method: 'GET' })

    // Verify no Authorization header
    expect(mockAxios.history.get[0].headers?.Authorization).toBeUndefined()
  })

  it('returns data on successful request', async () => {
    mockAxios.onGet('/success').reply(200, { data: 'ok' })
    const result = await client.request({ url: '/success', method: 'GET' })
    expect(result).toEqual({ data: 'ok' })
  })

  it('calls handleApiError on request failure', async () => {
    mockAxios.onGet('/error').reply(500, { error: 'Server error' })

    await expect(
      client.request({ url: '/error', method: 'GET' }),
    ).rejects.toThrow()

    expect(handleApiError).toHaveBeenCalled()
  })
})
