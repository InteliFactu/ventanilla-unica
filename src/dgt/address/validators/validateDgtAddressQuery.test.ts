import { describe, expect, it } from 'vitest'

import { validateDgtAddressQuery } from './validateDgtAddressQuery'

const options = {
  nif: ' 12345678z ',
  'tipo-via': 'calle',
  via: 'Mayor',
  numero: '7',
  'codigo-postal': '28001',
  municipio: 'Madrid',
  provincia: 'Madrid',
}

describe('validateDgtAddressQuery', () => {
  it('normalises the address and leaves the absent parts empty', () => {
    expect(validateDgtAddressQuery(options)).toEqual({
      nif: '12345678Z',
      tipoVia: 'CALLE',
      via: 'MAYOR',
      numero: '7',
      planta: '',
      puerta: '',
      cp: '28001',
      municipio: 'MADRID',
      provincia: 'MADRID',
      localidad: '',
    })
  })

  it('refuses a bad NIF, a missing part and a bad postal code', () => {
    expect(() => validateDgtAddressQuery({ ...options, nif: 'X1' })).toThrow(
      '--nif',
    )
    expect(() => validateDgtAddressQuery({ ...options, via: ' ' })).toThrow(
      '--via is required',
    )
    expect(() =>
      validateDgtAddressQuery({ ...options, 'codigo-postal': '2800' }),
    ).toThrow('five digits')
  })
})
