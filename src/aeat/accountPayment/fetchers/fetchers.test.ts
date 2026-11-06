import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchAccountPaymentForm } from './fetchAccountPaymentForm'
import { fetchCollaboratingEntities } from './fetchCollaboratingEntities'
import { postAccountPaymentForm } from './postAccountPaymentForm'

const portal = (status: number) =>
  vi.fn<HttpClient['request']>().mockResolvedValue({
    status,
    url: '',
    headers: {},
    body: Buffer.from('page'),
    text: 'page',
  })
const client = (request: HttpClient['request']): HttpClient => ({
  request,
  cookie: () => undefined,
})

describe('account-payment fetchers', () => {
  it('GETs the form and the entity list', async () => {
    const request = portal(200)
    expect(await fetchAccountPaymentForm(client(request))).toBe('page')
    expect(await fetchCollaboratingEntities(client(request))).toBe('page')
    expect(request.mock.calls.map(([url]) => url)).toEqual([
      'https://www1.agenciatributaria.gob.es/wlpl/OVPP-PAGO/LiquidacionesCuenta',
      'https://www1.agenciatributaria.gob.es/wlpl/OVPP-PAGO/VerEntidadesAdheridas?idcodOpe=002',
    ])
  })

  it('POSTs a step as ISO-8859-1', async () => {
    const request = portal(200)
    await postAccountPaymentForm(client(request), {
      action: 'https://x.test/a',
      fields: { idape: 'MUÑOZ ANA' },
    })
    expect(request.mock.calls[0]?.[1]).toMatchObject({
      method: 'POST',
      body: 'idape=MU%D1OZ+ANA',
    })
  })

  it('throws on a non-200 answer', async () => {
    const failed = client(portal(500))
    await expect(fetchAccountPaymentForm(failed)).rejects.toThrow('HTTP 500')
    await expect(fetchCollaboratingEntities(failed)).rejects.toThrow('HTTP 500')
    await expect(
      postAccountPaymentForm(failed, {
        action: 'https://x.test/a',
        fields: {},
      }),
    ).rejects.toThrow('HTTP 500')
  })
})
