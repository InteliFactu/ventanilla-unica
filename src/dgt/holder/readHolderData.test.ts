import { describe, expect, it } from 'vitest'

import { scriptedClient } from '../../http/fixtures/scriptedClient'
import { dgtAtexAnswer } from '../fixtures/dgtAtexAnswer'
import { dgtJsonResponse } from '../fixtures/dgtJsonResponse'
import { dgtLoginResponses } from '../fixtures/dgtLoginResponses'
import { dgtUrls } from '../session/dgtUrls'
import { readHolderData } from './readHolderData'

describe('readHolderData', () => {
  it('logs in with the certificate IdP and reads identity, address and contact', async () => {
    const client = scriptedClient(
      ...dgtLoginResponses(),
      dgtJsonResponse(dgtUrls.atex, dgtAtexAnswer),
      dgtJsonResponse(dgtUrls.saviSubscription, {
        ok: { email: 'ana@example.es', tel: '0034600000000' },
      }),
      dgtJsonResponse(dgtUrls.miDgtHome, {}),
      dgtJsonResponse(dgtUrls.miDgtCounters, {
        NumeroVehiculos: '3',
        AlertaVehiculos: 0,
      }),
      dgtJsonResponse(dgtUrls.miDgtCounters, {
        NumeroSanciones: '1',
        AlertaSanciones: 0,
      }),
      dgtJsonResponse(dgtUrls.miDgtCounters, { NumeroRegistros: '1' }),
      dgtJsonResponse(dgtUrls.miDgtCounters, { NumeroPuntos: '15' }),
      dgtJsonResponse(dgtUrls.miDgtCounters, { NumeroPermisos: '-' }),
      dgtJsonResponse(dgtUrls.miDgtCounters, {
        NumeroRepresentantes: '0',
        NumeroRepresentados: '0',
      }),
      dgtJsonResponse(dgtUrls.miDgtCounters, { NumeroCitas: '0' }),
    )
    const data = await readHolderData(client, '12345678Z')
    expect(data).toMatchObject({
      nif: '12345678Z',
      nombre: 'ANA PEREZ GIL',
      direccionNotificaciones: {
        texto: 'CALLE MAYOR, 7, 28001 Madrid, (Madrid)',
      },
      contacto: { email: 'ana@example.es', telefono: '0034600000000' },
      contadores: {
        vehiculos: 3,
        sanciones: 1,
        puntos: 15,
        permisos: undefined,
        avisosSanciones: 0,
      },
    })
    const chooserPost = client.request.mock.calls[2]?.[1]
    expect(chooserPost?.form?.['SelectedIdP']).toBe('AFIRMA')
    expect(client.request.mock.calls[3]?.[1]?.form).toEqual({
      nifTitular: '12345678Z',
      vehiculos: 'false',
      numVehiculosGF: '20',
    })
  })

  it('stops when the protected page carries no Cl@ve form', async () => {
    const client = scriptedClient(
      dgtJsonResponse(dgtUrls.subscriptionsPage, {}),
    )
    await expect(readHolderData(client, '12345678Z')).rejects.toThrow(
      'no Cl@ve SAML form',
    )
  })
})
