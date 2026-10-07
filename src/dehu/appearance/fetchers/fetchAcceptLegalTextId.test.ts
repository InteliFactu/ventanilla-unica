import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { dehuUrls } from '../../api/dehuUrls'
import { fetchAcceptLegalTextId } from './fetchAcceptLegalTextId'

const json = (value: unknown): HttpResponse => {
  const text = JSON.stringify(value)
  return { status: 200, url: '', headers: {}, body: Buffer.from(text), text }
}

describe('fetchAcceptLegalTextId', () => {
  it('reads the id of the access legal text with the bearer', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValue(json({ id: 901, content: 'El acceso...' }))
    const client: HttpClient = { request, cookie: () => undefined }
    await expect(fetchAcceptLegalTextId(client, 'JWT')).resolves.toBe('901')
    expect(request.mock.calls[0]?.[0]).toBe(dehuUrls.acceptLegalText)
    expect(request.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      'Bearer JWT',
    )
  })

  it('fails when the answer carries no id', async () => {
    const client: HttpClient = {
      request: vi.fn().mockResolvedValue(json({ content: 'x' })),
      cookie: () => undefined,
    }
    await expect(fetchAcceptLegalTextId(client, 'JWT')).rejects.toThrow('no id')
  })
})
