import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { listOargtLiquidations } from './listOargtLiquidations'

const page = (text: string): HttpResponse => ({
  status: 200,
  url: 'https://sede.oargt.es/sta/CarpetaPrivate/doEvent?PAGE_CODE=LISTALIQ',
  headers: {},
  body: Buffer.from(text),
  text,
})

describe('listOargtLiquidations', () => {
  it('reports the contact-data gate and leaves the lists unknown', async () => {
    const request = vi
      .fn<HttpClient['request']>()
      .mockResolvedValueOnce(page('<p>ok</p>'))
      .mockResolvedValueOnce(
        page(
          '<p>Proceda a Validar los datos referentes a Medios de Contacto y Datos Identificativos.</p>',
        ),
      )
    const result = await listOargtLiquidations({
      request,
      cookie: () => undefined,
    })
    expect(result.contactConfirmationPending).toBe(true)
    expect(result.hasLiquidations).toBeUndefined()
    expect(request).toHaveBeenCalledTimes(2)
  })
})
