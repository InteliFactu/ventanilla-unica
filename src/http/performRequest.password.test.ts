import { EventEmitter } from 'node:events'
import type { ClientRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import { PassThrough } from 'node:stream'

import { expect, it, vi } from 'vitest'

import { CookieJar } from './CookieJar'
import { performRequest } from './performRequest'

vi.mock('node:https', () => ({ request: vi.fn() }))
it('omits TLS certificate fields for password sessions without opening a socket', async () => {
  const mocked = vi.mocked(httpsRequest)
  mocked.mockImplementation(() => {
    const request = new EventEmitter() as ClientRequest
    request.end = vi.fn(() => {
      queueMicrotask(() => {
        const response = Object.assign(new PassThrough(), {
          statusCode: 200,
          headers: { 'set-cookie': ['session=fake; Path=/'] },
        })
        request.emit('response', response)
        response.end(Buffer.from('login'))
      })
      return request
    })
    return request
  })
  const jar = new CookieJar()
  expect(
    (await performRequest('https://rayuela.educarex.es/', undefined, jar, {}))
      .text,
  ).toBe('login')
  const options = mocked.mock.calls[0]?.[0]
  expect(options).not.toHaveProperty('cert')
  expect(options).not.toHaveProperty('key')
  expect(options).not.toHaveProperty('passphrase')
  expect(jar.get('rayuela.educarex.es', 'session')).toBe('fake')
})
