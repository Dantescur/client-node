import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../src/api/app.ts'
import { QvaPayClient } from '../../src/core/client.ts'
import type {
  AppCreateParams,
  AppCreateResponse,
} from '../../src/interfaces/app.ts'

describe('App API', () => {
  let client: QvaPayClient
  let app: App
  let mockAxios: MockAdapter

  beforeEach(() => {
    client = new QvaPayClient({ baseUrl: 'https://api.qvapay.com' })
    app = new App(client)
    // @ts-expect-error: access to private property
    mockAxios = new MockAdapter(client.instance)
  })

  afterEach(() => {
    mockAxios.restore()
  })

  describe('getAll', () => {
    it('should fetch all apps with GET /app', async () => {
      const mockResponse = {
        result: 'success',
        apps: [
          {
            uuid: 'app-uuid-1',
            name: 'Test App 1',
            url: 'https://example.com',
            logo: 'https://example.com/logo.png',
            description: 'Test app description',
            callback: 'https://example.com/callback',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            active: true,
            enabled: true,
            allowed_payment_auth: true,
            card: true,
            created_at: '2025-08-10T10:00:00Z',
            updated_at: '2025-08-10T10:00:00Z',
          },
        ],
      }

      mockAxios.onGet('/app').reply(200, mockResponse)

      const result = await app.getAll()

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe('/app')
      expect(mockAxios.history.get[0].method).toBe('get')
    })
  })

  describe('get', () => {
    it('should fetch an app by UUID with GET /{uuid}', async () => {
      const uuid = 'app-uuid-1'
      const mockResponse = {
        uuid,
        name: 'Test App',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
        description: 'Test app description',
        callback: 'https://example.com/callback',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        active: true,
        enabled: true,
        allowed_payment_auth: true,
        card: true,
        created_at: '2025-08-10T10:00:00Z',
        updated_at: '2025-08-10T10:00:00Z',
      }

      mockAxios.onGet(`/${uuid}`).reply(200, mockResponse)

      const result = await app.get(uuid)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.get).toHaveLength(1)
      expect(mockAxios.history.get[0].url).toBe(`/${uuid}`)
      expect(mockAxios.history.get[0].method).toBe('get')
    })
  })

  describe('delete', () => {
    it('should delete an app by UUID with DELETE /{uuid}', async () => {
      const uuid = 'app-uuid-1'
      const mockResponse = {
        uuid,
        name: 'Test App',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
        description: 'Test app description',
        callback: 'https://example.com/callback',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        active: false,
        enabled: false,
        allowed_payment_auth: false,
        card: false,
        created_at: '2025-08-10T10:00:00Z',
        updated_at: '2025-08-10T10:00:00Z',
      }

      mockAxios.onDelete(`/${uuid}`).reply(200, mockResponse)

      const result = await app.delete(uuid)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.delete).toHaveLength(1)
      expect(mockAxios.history.delete[0].url).toBe(`/${uuid}`)
      expect(mockAxios.history.delete[0].method).toBe('delete')
    })
  })

  describe('create', () => {
    it('should create an app with POST /app/create', async () => {
      const appParams: AppCreateParams = {
        name: 'New App',
        url: 'https://newapp.com',
        logo: 'https://newapp.com/logo.png',
        callback: 'https://newapp.com/callback',
        success_url: 'https://newapp.com/success',
        cancel_url: 'https://newapp.com/cancel',
      }

      const mockResponse: AppCreateResponse = {
        result: 'success',
        app: {
          uuid: 'app-uuid-2',
          secret: 'app-secret',
          name: appParams.name,
          url: appParams.url,
          desc: 'New app description',
          logo: appParams.logo,
        },
      }

      mockAxios.onPost('/app/create').reply(200, mockResponse)

      const result = await app.create(appParams)

      expect(result).toEqual(mockResponse)
      expect(mockAxios.history.post).toHaveLength(1)
      expect(mockAxios.history.post[0].url).toBe('/app/create')
      expect(mockAxios.history.post[0].method).toBe('post')
      expect(JSON.parse(mockAxios.history.post[0].data)).toEqual(appParams)
    })
  })

  describe('error handling', () => {
    it('should throw an error when getAll fails', async () => {
      mockAxios.onGet('/app').reply(500, { error: 'Server error' })

      await expect(app.getAll()).rejects.toThrow()
    })

    it('should throw an error when get fails', async () => {
      const uuid = 'app-uuid-1'
      mockAxios.onGet(`/${uuid}`).reply(404, { error: 'App not found' })

      await expect(app.get(uuid)).rejects.toThrow()
    })

    it('should throw an error when delete fails', async () => {
      const uuid = 'app-uuid-1'
      mockAxios.onDelete(`/${uuid}`).reply(403, { error: 'Forbidden' })

      await expect(app.delete(uuid)).rejects.toThrow()
    })

    it('should throw an error when create fails', async () => {
      const appParams: AppCreateParams = {
        name: 'New App',
        url: 'https://newapp.com',
        logo: 'https://newapp.com/logo.png',
        callback: 'https://newapp.com/callback',
        success_url: 'https://newapp.com/success',
        cancel_url: 'https://newapp.com/cancel',
      }

      mockAxios
        .onPost('/app/create')
        .reply(400, { error: 'Invalid parameters' })

      await expect(app.create(appParams)).rejects.toThrow()
    })
  })
})
