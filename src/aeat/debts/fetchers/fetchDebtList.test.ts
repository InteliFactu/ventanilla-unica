import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchDebtList } from './fetchDebtList'

describe('fetchDebtList', () => {
  it('opens ConsultaDdas before posting SALTAR with iso-8859-15 decoding', async () => {
    const url =
      'https://www1.agenciatributaria.gob.es/wlpl/SRVO-JDIT/ConsultaDdas'
    const request = vi.fn<HttpClient['request']>().mockResolvedValue({
      status: 200,
      url,
      headers: {},
      body: Buffer.alloc(0),
      text: '<html>debts</html>',
    })
    const client: HttpClient = { request, cookie: () => undefined }
    const html = await fetchDebtList(client, '12345678Z')
    expect(html).toBe('<html>debts</html>')
    expect(request).toHaveBeenNthCalledWith(1, url, {
      defaultCharset: 'iso-8859-15',
    })
    expect(request).toHaveBeenNthCalledWith(2, url, {
      method: 'POST',
      form: {
        fnif: '12345678Z',
        faccion: 'CONS_DDAS',
        faccionboton: 'SALTAR',
        flistadoselecc: '',
        ACEPTAR: 'Aceptar',
      },
      defaultCharset: 'iso-8859-15',
    })
  })
})
