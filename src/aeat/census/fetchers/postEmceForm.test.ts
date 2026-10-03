import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { postEmceForm } from './postEmceForm'

describe('postEmceForm', () => {
  it('POSTs the pre-encoded body with a Latin-1 content type', async () => {
    const request = vi.fn<HttpClient['request']>(async () =>
      Promise.resolve({
        status: 200,
        url: '',
        headers: {},
        body: Buffer.from('page'),
        text: 'page',
      }),
    )
    const client: HttpClient = { request, cookie: () => undefined }

    expect(
      await postEmceForm(client, 'ServletSitCenInternet', 'a=1&b=%D1'),
    ).toBe('page')
    const [, options] = request.mock.calls[0] ?? []
    expect(options?.method).toBe('POST')
    expect(options?.body).toBe('a=1&b=%D1')
    expect(options?.headers?.['Content-Type']).toMatch(/ISO-8859-1/)
  })
})
