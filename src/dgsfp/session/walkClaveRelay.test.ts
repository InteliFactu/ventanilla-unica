import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { respondWith } from '../../sta/registry/fixtures/respondWith'
import { walkClaveRelay } from './walkClaveRelay'

describe('walkClaveRelay', () => {
  it('throws when the relay stops off the sede', async () => {
    const client: HttpClient = {
      request: vi.fn<HttpClient['request']>(),
      cookie: () => undefined,
    }
    await expect(
      walkClaveRelay(
        client,
        respondWith('https://pasarela.clave.gob.es/Proxy2/x', '<p>error</p>'),
      ),
    ).rejects.toThrow('did not reach the sede')
  })
})
