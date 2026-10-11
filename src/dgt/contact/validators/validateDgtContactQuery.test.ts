import { describe, expect, it } from 'vitest'

import { validateDgtContactQuery } from './validateDgtContactQuery'

describe('validateDgtContactQuery', () => {
  it('normalises the NIF and the phone to the form the sede posts', () => {
    expect(
      validateDgtContactQuery({
        nif: ' 12345678z ',
        correo: 'a@b.es',
        telefono: '600 000 000',
      }),
    ).toEqual({ nif: '12345678Z', email: 'a@b.es', telefono: '0034600000000' })
    expect(
      validateDgtContactQuery({
        nif: 'X1234567L',
        correo: 'a@b.es',
        telefono: '+351912345678',
      }).telefono,
    ).toBe('00351912345678')
  })

  it('refuses a bad NIF, email or phone', () => {
    expect(() =>
      validateDgtContactQuery({ correo: 'a@b.es', telefono: '600000000' }),
    ).toThrow('--nif')
    expect(() =>
      validateDgtContactQuery({
        nif: '12345678Z',
        correo: 'nope',
        telefono: '600000000',
      }),
    ).toThrow('--correo')
    expect(() =>
      validateDgtContactQuery({
        nif: '12345678Z',
        correo: 'a@b.es',
        telefono: '123',
      }),
    ).toThrow('--telefono')
  })
})
