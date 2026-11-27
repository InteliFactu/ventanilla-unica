import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { fetchAgreements } from './fetchAgreements'

const page = (url: string, text: string): HttpResponse => ({
  status: 200,
  url,
  headers: {},
  body: Buffer.alloc(0),
  text,
})

const listingHtml = `
<a href='/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&amp;cacuerdo=101440306486W&amp;fFigura=obli'>101440306486W</a>
`

const detailHtml = `
<p>Acuerdo: 101440306486W (Acuerdo finalizado e ingresado)</p>
<p>Tipo resolución: Concesión</p>
<p>Importe acuerdo: 565,03</p>
`

describe('fetchAgreements', () => {
  it('lists every agreement and fetches its detail', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValueOnce(
        page(
          'https://www1.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.sraf.solicitud.SolAccionW?fAccion=petic&fFigura=obli',
          listingHtml,
        ),
      )
      .mockResolvedValueOnce(
        page(
          'https://www1.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&cacuerdo=101440306486W&fFigura=obli',
          detailHtml,
        ),
      )
    const client: HttpClient = { request, cookie: () => undefined }
    const agreements = await fetchAgreements(client)
    expect(agreements).toEqual([
      {
        acuerdo: '101440306486W',
        estado: 'Acuerdo finalizado e ingresado',
        resolucion: 'Concesión',
        importe: { text: '565,03', amount: 565.03 },
        notificado: undefined,
        plazos: undefined,
        primerPlazo: undefined,
        deudas: [],
        instalments: [],
      },
    ])
    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls[1]?.[0]).toBe(
      'https://www1.agenciatributaria.gob.es/wlpl/inwinvoc/es.aeat.dit.adu.sraf.acuerdo.AcuAccDeta?fAccion=deta&cacuerdo=101440306486W&fFigura=obli',
    )
    expect(request.mock.calls[1]?.[1]).toEqual({ followRedirects: false })
  })

  it('returns an empty list when the listing page carries no agreement', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValue(page('https://www1.agenciatributaria.gob.es/x', ''))
    const client: HttpClient = { request, cookie: () => undefined }
    expect(await fetchAgreements(client)).toEqual([])
    expect(request).toHaveBeenCalledTimes(1)
  })
})
