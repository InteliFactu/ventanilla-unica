import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { postNotificationAcceptance } from './postNotificationAcceptance'

describe('postNotificationAcceptance', () => {
  it('posts the aceptar operation with the appearance bearer and returns the status', async () => {
    const request = vi.fn<HttpClient['request']>().mockResolvedValue({
      status: 200,
      url: '',
      headers: {},
      body: Buffer.from('{}'),
      text: '{}',
    })
    const client: HttpClient = { request, cookie: () => undefined }
    await expect(
      postNotificationAcceptance(client, 'NEW', 'REF1'),
    ).resolves.toBe(200)
    const [url, options] = request.mock.calls[0] ?? []
    expect(url).toBe(
      'https://dehu.redsara.es/api/v1/notifications/REF1/voucher',
    )
    expect(options?.method).toBe('POST')
    expect(options?.body).toBe('{"operation":"aceptar"}')
    expect(options?.headers?.['Authorization']).toBe('Bearer NEW')
    expect(options?.headers?.['Content-Type']).toBe('application/json')
  })
})
