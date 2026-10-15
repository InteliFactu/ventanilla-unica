import { describe, expect, it, vi } from 'vitest'

import { createHttpClient } from './createHttpClient'
import { performRequest } from './performRequest'
import type { HttpResponse } from './types/HttpResponse'

// The transport is stubbed here so the redirect and cookie logic is exercised
// alone; the real TLS exchange has its own test next to performRequest.
vi.mock('./performRequest', () => ({ performRequest: vi.fn() }))

const identity = { cert: Buffer.from('c'), key: Buffer.from('k') }

const start = 'https://sede.sepe.gob.es/start'

const redirect = (url: string, location: string): HttpResponse => ({
  status: 302,
  url,
  headers: { location },
  body: Buffer.alloc(0),
  text: '',
})

describe('createHttpClient', () => {
  it('follows redirects with a GET and returns the final response', async () => {
    const mocked = vi.mocked(performRequest)
    mocked.mockResolvedValueOnce(redirect(start, '/next'))
    mocked.mockResolvedValueOnce({
      status: 200,
      url: 'https://sede.sepe.gob.es/next',
      headers: {},
      body: Buffer.from('done'),
      text: 'done',
    })
    const client = createHttpClient(identity)
    const response = await client.request(start, {
      form: { a: '1' },
    })
    expect(response.text).toBe('done')
    expect(mocked).toHaveBeenCalledTimes(2)
    expect(mocked.mock.calls[1]?.[0]).toBe('https://sede.sepe.gob.es/next')
    expect(mocked.mock.calls[1]?.[3]).toMatchObject({ method: 'GET' })
  })

  it('refuses a redirect to a host outside the administrations', async () => {
    const mocked = vi.mocked(performRequest)
    mocked.mockReset()
    mocked.mockResolvedValueOnce(redirect(start, 'https://evil.example/grab'))
    const client = createHttpClient(identity)
    await expect(client.request(start)).rejects.toThrow(
      'refused request to evil.example',
    )
    expect(mocked).toHaveBeenCalledTimes(1)
  })

  it('refuses a first request to a host outside the administrations', async () => {
    const mocked = vi.mocked(performRequest)
    mocked.mockReset()
    const client = createHttpClient(identity)
    await expect(
      client.request('https://evil.example/form-action', { form: { a: '1' } }),
    ).rejects.toThrow('refused request to evil.example')
    expect(mocked).not.toHaveBeenCalled()
  })

  it('follows a redirect to another administration host', async () => {
    const mocked = vi.mocked(performRequest)
    mocked.mockReset()
    mocked.mockResolvedValueOnce(
      redirect(
        'https://sp.seg-social.es/start',
        'https://pasarela.clave.gob.es/login',
      ),
    )
    mocked.mockResolvedValueOnce({
      status: 200,
      url: 'https://pasarela.clave.gob.es/login',
      headers: {},
      body: Buffer.alloc(0),
      text: 'ok',
    })
    const client = createHttpClient(identity)
    const response = await client.request('https://sp.seg-social.es/start')
    expect(response.text).toBe('ok')
  })

  it('stops at the redirect when asked not to follow, and gives up on loops', async () => {
    const loopUrl = 'https://sede.sepe.gob.es/loop'
    vi.mocked(performRequest).mockResolvedValue(redirect(loopUrl, '/loop'))
    const client = createHttpClient(identity)
    const stopped = await client.request(loopUrl, { followRedirects: false })
    expect(stopped.status).toBe(302)
    await expect(client.request(loopUrl)).rejects.toThrow('too many redirects')
    expect(client.cookie('sede.sepe.gob.es', 'none')).toBeUndefined()
  })
})

it('builds a password-session client without a certificate identity', async () => {
  const mocked = vi.mocked(performRequest)
  mocked.mockReset()
  mocked.mockResolvedValueOnce({
    url: 'https://rayuela.educarex.es/',
    status: 200,
    headers: {},
    body: Buffer.alloc(0),
    text: 'login',
  })
  expect(
    (await createHttpClient().request('https://rayuela.educarex.es/')).text,
  ).toBe('login')
  expect(mocked.mock.calls[0]?.[1]).toBeUndefined()
})
