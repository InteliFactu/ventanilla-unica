import { expect, it, vi } from 'vitest'
import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchRayuelaResponse } from './fetchRayuelaResponse'

it('applies Latin-1 decoding and rejects HTTP errors and unexpected origins', async () => {
  const request = vi.fn<HttpClient['request']>().mockResolvedValue({
    url: 'https://rayuela.educarex.es/',
    status: 500,
    headers: {},
    body: Buffer.alloc(0),
    text: 'Server error',
  })
  const client: HttpClient = { request, cookie: () => undefined }
  await expect(
    fetchRayuelaResponse(client, 'https://rayuela.educarex.es/'),
  ).rejects.toThrow('HTTP 500')
  expect(request.mock.calls[0]?.[1]?.defaultCharset).toBe('iso-8859-1')
  await expect(
    fetchRayuelaResponse(client, 'https://evil.example'),
  ).rejects.toThrow('unexpected URL')
  expect(request).toHaveBeenCalledTimes(1)
})

it('follows Rayuela redirects itself and refuses one that leaves Rayuela', async () => {
  const hop = (status: number, location?: string) => ({
    url: 'https://rayuela.educarex.es/a',
    status,
    headers: location === undefined ? {} : { location },
    body: Buffer.alloc(0),
    text: 'ok',
  })
  const request = vi
    .fn<HttpClient['request']>()
    .mockResolvedValueOnce(hop(302, '/b'))
    .mockResolvedValueOnce(hop(200))
    .mockResolvedValueOnce(hop(302, 'https://other.gob.es/collect?token=x'))
  const client: HttpClient = { request, cookie: () => undefined }
  await fetchRayuelaResponse(client, 'https://rayuela.educarex.es/a', {
    method: 'POST',
    form: { a: '1' },
  })
  expect(request.mock.calls[1]?.[0]).toBe('https://rayuela.educarex.es/b')
  expect(request.mock.calls[1]?.[1]?.method).toBeUndefined()
  expect(request.mock.calls[0]?.[1]?.followRedirects).toBe(false)
  await expect(
    fetchRayuelaResponse(client, 'https://rayuela.educarex.es/a'),
  ).rejects.toThrow('unexpected URL')
  expect(request).toHaveBeenCalledTimes(3)
})
