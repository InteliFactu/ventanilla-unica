import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchEmceEntryPage } from './fetchEmceEntryPage'

describe('fetchEmceEntryPage', () => {
  it('GETs the servlet decoded as Latin-1', async () => {
    const request = vi.fn<HttpClient['request']>(async () =>
      Promise.resolve({
        status: 200,
        url: '',
        headers: {},
        body: Buffer.from('ok'),
        text: 'ok',
      }),
    )
    const client: HttpClient = { request, cookie: () => undefined }

    expect(await fetchEmceEntryPage(client, 'ServletSitCenInternet')).toBe('ok')
    expect(request).toHaveBeenCalledWith(
      'https://www1.agenciatributaria.gob.es/wlpl/EMCE-JDIT/ServletSitCenInternet',
      { defaultCharset: 'iso-8859-1' },
    )
  })
})
