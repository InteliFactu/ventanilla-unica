import { ClientRequest } from 'node:http'
import { request } from 'node:https'
import { Socket } from 'node:net'
import { Readable } from 'node:stream'

import { describe, expect, it, vi } from 'vitest'

import { CookieJar } from './CookieJar'
import { performRequest } from './performRequest'

vi.mock('node:https', () => ({ request: vi.fn() }))

describe('legacy portal response headers', () => {
  it.each([
    ['https://garantiajuvenil.sepe.es/loginClave', true],
    ['https://sede.sepe.gob.es/start', false],
    ['https://garantiajuvenil.sepe.es.evil.test/start', false],
  ])('limits folded-header compatibility to %s', async (url, expected) => {
    const outgoing = new ClientRequest({
      host: 'portal.invalid',
      createConnection: () => new Socket(),
    })
    outgoing.end = vi.fn(() => {
      queueMicrotask(() => {
        outgoing.emit(
          'response',
          Object.assign(Readable.from([]), {
            statusCode: 200,
            headers: {},
          }),
        )
      })
      return outgoing
    })
    vi.mocked(request).mockReturnValueOnce(outgoing)
    await performRequest(url, undefined, new CookieJar(), {})
    expect(vi.mocked(request).mock.lastCall?.[0]).toHaveProperty(
      'insecureHTTPParser',
      expected,
    )
  })
})
