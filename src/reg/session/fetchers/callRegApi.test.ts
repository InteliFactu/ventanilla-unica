import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { respondWith } from '../../../sta/registry/fixtures/respondWith'
import { callRegApi } from './callRegApi'

describe('callRegApi', () => {
  it('sends one Accept-Language tag and the bearer, and fails on an error status', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValue(
        respondWith('https://reg-api.redsara.es/x', '{"code":"ko"}', 400),
      )
    await expect(
      callRegApi({ request, cookie: () => undefined }, 't', 'x', '{}'),
    ).rejects.toThrow('REG: x answered 400')
    expect(request.mock.calls[0]?.[1]?.headers).toMatchObject({
      'Accept-Language': 'es-ES',
      Authorization: 'Bearer t',
      'Content-Type': 'application/json',
    })
  })
})
