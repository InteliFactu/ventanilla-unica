import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { listTeaExpedientes } from './listTeaExpedientes'
import { teaExpedientesUrl } from './teaExpedientesUrl'

const nif = '00000000T'
const emptyList =
  '<span class="negrita">00000000T - TEST HOLDER</span><ul><li>No existen expedientes que mostrar</li></ul>'

describe('listTeaExpedientes', () => {
  it('reports the official certificate identification redirect', async () => {
    const client = scriptedClient(
      htmlResponse(
        'https://sede.agenciatributaria.gob.es/Sede/errores/erro4033.html',
        '<h1>403</h1><p>Error de identificación</p>',
      ),
    )

    await expect(listTeaExpedientes(client, nif)).rejects.toThrow(
      'TEA: the sede could not identify the electronic certificate',
    )
  })

  it('refuses a response that left the case list page', async () => {
    const client = scriptedClient(
      htmlResponse(new URL('/other', teaExpedientesUrl).href, emptyList),
    )

    await expect(listTeaExpedientes(client, nif)).rejects.toThrow(
      'TEA: the response did not reach Mis expedientes',
    )
  })

  it.each([403, 500])(
    'refuses HTTP %i from the case list page',
    async (status) => {
      const client = scriptedClient({
        ...htmlResponse(teaExpedientesUrl, emptyList),
        status,
      })

      await expect(listTeaExpedientes(client, nif)).rejects.toThrow(
        `TEA: Mis expedientes returned HTTP ${String(status)}`,
      )
    },
  )

  it('reads the expected holder at the case list endpoint', async () => {
    const client = scriptedClient(htmlResponse(teaExpedientesUrl, emptyList))

    await expect(listTeaExpedientes(client, nif)).resolves.toMatchObject({
      nif,
      hasExpedientes: false,
    })
    expect(client.request.mock.calls).toEqual([[teaExpedientesUrl]])
  })
})
