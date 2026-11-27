import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { fetchPendingNotifications } from './fetchPendingNotifications'

const jsonPage = (body: unknown): HttpResponse => {
  const text = JSON.stringify(body)
  return {
    status: 200,
    url: 'https://dehu.redsara.es/api/v1/notifications',
    headers: {},
    body: Buffer.from(text),
    text,
  }
}

const item = {
  identifier: 'N1',
  concept: 'Concept',
  emitterEntity: 'Agencia Estatal de Administracion Tributaria',
  availabilityDate: '2026-01-01T00:00:00+01:00',
  expirationDate: '2026-01-11T00:00:00+01:00',
}

describe('fetchPendingNotifications', () => {
  it('stops after one short page and sends the bearer token', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValueOnce(jsonPage({ items: [item] }))
    const client: HttpClient = { request, cookie: () => undefined }

    const result = await fetchPendingNotifications(client, 'TOKEN')

    expect(result.pages).toBe(1)
    expect(result.notifications).toHaveLength(1)
    expect(result.notifications[0]).toMatchObject({
      id: 'N1',
      state: 'pending',
    })
    const [url, options] = request.mock.calls[0] ?? []
    expect(url).toContain('page=1')
    expect(url).toContain('limit=50')
    expect(options).toMatchObject({
      headers: { Authorization: 'Bearer TOKEN', Accept: 'application/json' },
    })
  })

  it('pages while the API keeps answering a full page', async () => {
    const fullPage = Array.from({ length: 50 }, (_unused, index) => ({
      ...item,
      identifier: `N${String(index)}`,
    }))
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValueOnce(jsonPage({ items: fullPage }))
      .mockResolvedValueOnce(jsonPage({ items: [] }))
    const client: HttpClient = { request, cookie: () => undefined }

    const result = await fetchPendingNotifications(client, 'TOKEN')

    expect(result.pages).toBe(2)
    expect(result.notifications).toHaveLength(50)
  })

  it('fails on a repeated full page instead of paging indefinitely', async () => {
    const items = Array.from({ length: 50 }, (_unused, index) => ({
      ...item,
      identifier: `N${String(index)}`,
    }))
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValueOnce(jsonPage({ items }))
      .mockResolvedValueOnce(jsonPage({ items }))
      .mockResolvedValueOnce(jsonPage({ items: [] }))
    await expect(
      fetchPendingNotifications({ request, cookie: () => undefined }, 'TOKEN'),
    ).rejects.toThrow('repeated notification')
    expect(request).toHaveBeenCalledTimes(2)
  })
})
