import { describe, expect, it } from 'vitest'

import { tenderDetailHtml } from '../fixtures/tenderDetailHtml'
import { readTenderDetail } from './readTenderDetail'

describe('readTenderDetail', () => {
  it('reads the public detail of a tender', () => {
    expect(readTenderDetail(tenderDetailHtml(), 'https://x')).toEqual({
      expediente: '2026/0001',
      organoContratacion: 'Órgano de ejemplo',
      objeto: 'Servicio de maquetación de ejemplo',
      estado: 'Publicada',
      finPresentacion: '19/10/2026 23:59',
      enlace:
        'https://contrataciondelestado.es/wps/poc?uri=deeplink:detalle_licitacion&idEvl=abcDEF0123456%2B%3D%3D',
    })
  })

  it('refuses a page that is not a tender', () => {
    expect(() => readTenderDetail('<p/>', 'https://x')).toThrow(
      'no tender detail at https://x',
    )
  })
})
