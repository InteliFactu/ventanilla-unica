import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { dgtLoginResponses } from '../fixtures/dgtLoginResponses'
import { dgtSanctionDetailHtml } from '../fixtures/dgtSanctionDetailHtml'
import { dgtSanctionsHtml } from '../fixtures/dgtSanctionsHtml'
import { dgtUrls } from '../session/dgtUrls'
import { readSanctions } from './readSanctions'

const loginLandingOn = (text: string) => [
  ...dgtLoginResponses().slice(0, 2),
  htmlResponse(dgtUrls.sanctionsPage, text),
]

describe('readSanctions', () => {
  it('lists each fine with its detail fields', async () => {
    const client = scriptedClient(
      ...loginLandingOn(dgtSanctionsHtml),
      htmlResponse(dgtUrls.sanctionDetail, dgtSanctionDetailHtml),
    )
    expect(await readSanctions(client)).toEqual([
      {
        expediente: '060000000001',
        asunto: 'Terminadas',
        estado: 'TERMINADO POR PAGO',
        fechaDenuncia: '2026-03-09',
        provincia: 'Badajoz',
        importe: '100 €',
        detalle: {
          Pagado: 'SI',
          'Hecho catalogado':
            'CIRCULAR A 131 km/h, ESTANDO LIMITADA LA VELOCIDAD A 120 km/h.',
        },
        path: undefined,
      },
    ])
  })

  it('refuses a page without the sanctions table rather than report none', async () => {
    const client = scriptedClient(...loginLandingOn('<h1>Mi DGT</h1>'))
    await expect(readSanctions(client)).rejects.toThrow('no sanctions table')
  })
})
