import { describe, expect, it } from 'vitest'

import { htmlResponse } from '../../../http/fixtures/htmlResponse'
import { scriptedClient } from '../../../http/fixtures/scriptedClient'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'
import { resolveYouthGuaranteeMunicipalities } from './resolveYouthGuaranteeMunicipalities'

describe('municipality resolution (synthetic AJAX)', () => {
  it('resolves a name within its declared province using the portal JSON endpoint', async () => {
    const client = scriptedClient(
      htmlResponse(
        youthGuaranteeUrls.municipalities,
        JSON.stringify({
          listadoMunicipios: [
            { denominacionC: 'Cáceres', idMunicipioC: '10037' },
          ],
        }),
      ),
    )
    const result = await resolveYouthGuaranteeMunicipalities(client, {
      '2': {
        'datosDireccionDomicilio.tcodProvincia': '10',
        'datosDireccionDomicilio.tcodMunicipio': 'CACERES',
      },
    })
    expect(result['2']?.['datosDireccionDomicilio.tcodMunicipio']).toBe('10037')
    expect(client.request.mock.calls[0]?.[1]).toMatchObject({
      method: 'POST',
      body: '{"idProvincia":"10"}',
      followRedirects: false,
    })
  })
  it.each([
    ['missing', [{ denominacionC: 'Other', idMunicipioC: '10001' }]],
    [
      'ambiguous',
      [
        { denominacionC: 'Cáceres', idMunicipioC: '10037' },
        { denominacionC: 'CACERES', idMunicipioC: '10999' },
      ],
    ],
  ])(
    'refuses a %s municipality without selecting a fallback',
    async (message, listadoMunicipios) => {
      const client = scriptedClient(
        htmlResponse(
          youthGuaranteeUrls.municipalities,
          JSON.stringify({ listadoMunicipios }),
        ),
      )
      await expect(
        resolveYouthGuaranteeMunicipalities(client, {
          '2': {
            'datosDireccionDomicilio.tcodProvincia': '10',
            'datosDireccionDomicilio.tcodMunicipio': 'CACERES',
          },
        }),
      ).rejects.toThrow(message)
      expect(client.request.mock.calls).toHaveLength(1)
    },
  )
  it('rejects a municipality with no province before any lookup', async () => {
    const client = scriptedClient()
    await expect(
      resolveYouthGuaranteeMunicipalities(client, {
        '2': { 'datosDireccionDomicilio.tcodMunicipio': 'CACERES' },
      }),
    ).rejects.toThrow(/declare a province/)
    expect(client.request.mock.calls).toHaveLength(0)
  })
  it('resolves all three supported address groups independently, accepting offered IDs', async () => {
    const response = htmlResponse(
      youthGuaranteeUrls.municipalities,
      '{"listadoMunicipios":[{"denominacionC":"Cáceres","idMunicipioC":"10037"}]}',
    )
    const client = scriptedClient(response, response, response)
    const result = await resolveYouthGuaranteeMunicipalities(client, {
      '2': {
        'datosDireccionDomicilio.tcodProvincia': '10',
        'datosDireccionDomicilio.tcodMunicipio': '10037',
        'datosDireccionContacto.tcodProvincia': '10',
        'datosDireccionContacto.tcodMunicipio': 'Cáceres',
        'datosContacto.notificaApartadoCorreos.tcodProvincia': '10',
        'datosContacto.notificaApartadoCorreos.tcodMunicipio': ' caceres ',
      },
    })
    expect(
      Object.entries(result['2'] ?? {})
        .filter(([name]) => name.endsWith('tcodMunicipio'))
        .map(([, value]) => value),
    ).toEqual(['10037', '10037', '10037'])
  })
  it.each([
    '<html>Login</html>',
    '{"error":"expired"}',
    '{"listadoMunicipios":[{}]}',
  ])('rejects a malformed AJAX response', async (text) => {
    const client = scriptedClient(
      htmlResponse(youthGuaranteeUrls.municipalities, text),
    )
    await expect(
      resolveYouthGuaranteeMunicipalities(client, {
        '2': {
          'datosDireccionDomicilio.tcodProvincia': '10',
          'datosDireccionDomicilio.tcodMunicipio': 'CACERES',
        },
      }),
    ).rejects.toThrow(/invalid municipality response/)
  })
  it('rejects an HTTP error without parsing its envelope as a list', async () => {
    const client = scriptedClient({
      ...htmlResponse(youthGuaranteeUrls.municipalities, '{}'),
      status: 503,
    })
    await expect(
      resolveYouthGuaranteeMunicipalities(client, {
        '2': {
          'datosDireccionDomicilio.tcodProvincia': '10',
          'datosDireccionDomicilio.tcodMunicipio': 'CACERES',
        },
      }),
    ).rejects.toThrow(/lookup failed/)
  })
})
