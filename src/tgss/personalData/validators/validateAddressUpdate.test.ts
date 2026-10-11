import { describe, expect, it } from 'vitest'

import { validateAddressUpdate } from './validateAddressUpdate'

const valid = {
  'tipo-via': 'cl',
  via: 'Mayor',
  numero: '5',
  'codigo-postal': '28001',
  localidad: 'Madrid',
  puerta: 'b',
}

describe('validateAddressUpdate', () => {
  it('upper-cases the parts the form stores upper-case and fills the absent ones', () => {
    expect(validateAddressUpdate(valid)).toEqual({
      tipoVia: 'CL',
      nombreVia: 'MAYOR',
      numero: '5',
      bis: '',
      bloque: '',
      escalera: '',
      piso: '',
      puerta: 'B',
      codigoPostal: '28001',
      localidad: 'MADRID',
    })
  })

  it('rejects an unknown street type, a missing part or a bad postcode', () => {
    expect(() => validateAddressUpdate({ ...valid, 'tipo-via': 'XX' })).toThrow(
      /--tipo-via/,
    )
    expect(() => validateAddressUpdate({ ...valid, via: '' })).toThrow(/--via/)
    expect(() =>
      validateAddressUpdate({ ...valid, 'codigo-postal': '2800' }),
    ).toThrow(/--codigo-postal/)
  })
})
