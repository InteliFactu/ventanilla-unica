import { describe, expect, it, vi } from 'vitest'

import type { HttpClient } from '../../http/types/HttpClient'
import { postM036Event } from '../taxAddress/fetchers/postM036Event'
import type { M036Session } from '../taxAddress/types/M036Session'
import { fillDeregistration } from './fillDeregistration'

vi.mock('../taxAddress/fetchers/postM036Event', () => ({
  postM036Event: vi.fn(async () => Promise.resolve('{"rs":[]}')),
}))

const html = [
  "['c','u150',{id:'T1_BAJA_CENSO_150'}]",
  "['c','u151',{id:'T1_BAJA_CAUSA_151',x:1}]",
  "['d','u152',{format:'dd/MM/yyyy',id:'T1_BAJA_FECHA_152'}]",
  "['t','uL',{id:'T1_LUGAR'}]['t','uC',{id:'T1_FIRMA_EN_CALIDAD'}]['t','uF',{id:'T1_FIRMADO'}]",
  "['g','tS',{id:'tablaSucesores'}]['b','uN',{id:'_id_nuevo'}]",
  "['t','s1',{id:'SUCESORES_NIF'}]['t','s2',{id:'SUCESORES_NOMBRE'}]",
  "['t','s3',{id:'SUCESORES_PORCENTAJE_LPH'}]['t','s4',{id:'SUCESORES_CUOTA_LPH'}]",
  "['b','sG',{id:'botonGuardarSucesor'}]",
].join('')

describe('fillDeregistration', () => {
  it('sends casillas 150-152, the signature and each sucesor', async () => {
    const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
    const session: M036Session = { client, desktopId: 'D', html, blobs: [html] }

    await fillDeregistration(session, {
      nif: 'E00000000',
      causa: 'otras',
      fecha: '31/10/2026',
      sucesores: [
        {
          nif: '11111111H',
          nombre: 'GARCIA ANA',
          porcentaje: '50',
          cuota: '0,00',
        },
      ],
      lugar: 'Madrid',
      firmado: 'GARCIA ANA',
      calidad: 'Representante',
      validate: true,
      confirm: false,
    })

    const uuids = vi
      .mocked(postM036Event)
      .mock.calls.map(([, , event]) => event.uuid)
    expect(uuids).toEqual([
      'u150',
      'u151',
      'u152',
      'uL',
      'uC',
      'uF',
      'uN',
      's1',
      's2',
      's3',
      's4',
      'sG',
    ])
    expect(vi.mocked(postM036Event).mock.calls[1]?.[2].data).toMatchObject({
      value: 'Otras causas de baja',
    })
    expect(vi.mocked(postM036Event).mock.calls[2]?.[2].data).toEqual({
      value: '2026.10.31.12.0.0.0',
      z$dateKeys: ['value'],
    })
  })

  it('stops on the successor popup error', async () => {
    vi.mocked(postM036Event).mockImplementation(async (_c, _d, event) =>
      Promise.resolve(
        event.uuid === 'sG'
          ? "['x','e',{id:'errorSucesores'}]['x','m',{value:'NIF incorrecto'}]"
          : '{"rs":[]}',
      ),
    )
    const client: HttpClient = { request: vi.fn(), cookie: () => undefined }
    const session: M036Session = { client, desktopId: 'D', html, blobs: [html] }

    await expect(
      fillDeregistration(session, {
        nif: 'E00000000',
        causa: 'otras',
        fecha: '31/10/2026',
        sucesores: [
          {
            nif: '11111111H',
            nombre: 'GARCIA ANA',
            porcentaje: '50',
            cuota: '0,00',
          },
        ],
        lugar: 'M',
        firmado: 'F',
        calidad: 'C',
        validate: true,
        confirm: false,
      }),
    ).rejects.toThrow(/NIF incorrecto/)
  })
})
