import { describe, expect, it } from 'vitest'

import { readAtexHolder } from './readAtexHolder'

const address = {
  domicilioCompleto: 'OK',
  tipoVia: 'CALLE',
  via: 'MAYOR',
  numeroVia: '7',
  planta: '2',
  puerta: 'B',
  escalera: '',
  cp: '28001',
  municipio: 'Madrid',
  provincia: 'Madrid',
}

describe('readAtexHolder', () => {
  it('reads a natural person and the notification address beside a vehicles error', () => {
    expect(
      readAtexHolder({
        personaFisica: {
          nif: '12345678Z',
          nombre: 'ANA',
          apellido1: 'PEREZ',
          apellido2: 'GIL',
        },
        domicilioCompleto: address,
        error: { errorCode: '006', errorMsg: 'Vehiculos - no disponible' },
      }),
    ).toEqual({
      nif: '12345678Z',
      nombre: 'ANA PEREZ GIL',
      direccionNotificaciones: {
        tipoVia: 'CALLE',
        via: 'MAYOR',
        numero: '7',
        planta: '2',
        puerta: 'B',
        escalera: '',
        cp: '28001',
        municipio: 'Madrid',
        provincia: 'Madrid',
        texto: 'CALLE MAYOR, 7, planta 2, puerta B, 28001 Madrid, (Madrid)',
      },
    })
  })

  it('names a legal person by its business name and leaves an incomplete address out', () => {
    expect(
      readAtexHolder({
        personaJuridica: { nif: 'B00000000', rs: 'EJEMPLO SL' },
        domicilioCompleto: { domicilioCompleto: 'KO' },
      }),
    ).toEqual({
      nif: 'B00000000',
      nombre: 'EJEMPLO SL',
      direccionNotificaciones: undefined,
    })
  })

  it('fails when the answer names no person', () => {
    expect(() => readAtexHolder({ error: { errorMsg: 'Sin datos' } })).toThrow(
      'Sin datos',
    )
    expect(() => readAtexHolder({})).toThrow('no person')
  })
})
