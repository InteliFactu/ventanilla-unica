import { describe, expect, it } from 'vitest'

import { validateNotaQuery } from './validateNotaQuery'

const options = {
  nif: 'b-00000000',
  email: 'notas@example.com',
  telefono: '600 000 000',
}

describe('validateNotaQuery', () => {
  it('normalises the NIF and defaults segments and IRPF', () => {
    expect(validateNotaQuery(options, false)).toMatchObject({
      nif: 'B00000000',
      telefono: '600000000',
      segments: ['administradores'],
      irpfRetention: true,
      direccion: undefined,
    })
  })

  it('refuses bad values', () => {
    expect(() =>
      validateNotaQuery({ ...options, nif: '00000000T' }, false),
    ).toThrow('--nif')
    expect(() => validateNotaQuery({ ...options, email: 'x' }, false)).toThrow(
      '--email',
    )
    expect(() =>
      validateNotaQuery({ ...options, telefono: '12' }, false),
    ).toThrow('--telefono')
    expect(() => validateNotaQuery({ ...options, irpf: 'yes' }, false)).toThrow(
      '--irpf',
    )
    expect(() =>
      validateNotaQuery({ ...options, segmentos: 'capital,foo' }, false),
    ).toThrow('--segmentos')
    expect(() =>
      validateNotaQuery({ ...options, segmentos: ',' }, false),
    ).toThrow('--segmentos')
    expect(() =>
      validateNotaQuery({ ...options, 'codigo-postal': '100' }, false),
    ).toThrow('five digits')
  })

  it('needs the billing address only to order', () => {
    expect(() => validateNotaQuery(options, true)).toThrow('--direccion')
    expect(
      validateNotaQuery(
        {
          ...options,
          direccion: 'C/ Uno 1',
          'codigo-postal': '10001',
          irpf: 'no',
          segmentos: 'libros, capital',
        },
        true,
      ),
    ).toMatchObject({
      codigoPostal: '10001',
      irpfRetention: false,
      segments: ['capital', 'libros'],
    })
  })
})
