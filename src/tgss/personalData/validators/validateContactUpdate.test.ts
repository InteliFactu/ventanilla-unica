import { describe, expect, it } from 'vitest'

import { validateContactUpdate } from './validateContactUpdate'

describe('validateContactUpdate', () => {
  it('normalises the phones and keeps the landline optional', () => {
    expect(
      validateContactUpdate({ movil: '600 111 222', correo: ' a@b.es ' }),
    ).toEqual({
      mobile: '600111222',
      email: 'a@b.es',
      landline: undefined,
    })
    expect(
      validateContactUpdate({
        movil: '600111222',
        correo: 'a@b.es',
        fijo: '927000000',
      }).landline,
    ).toBe('927000000')
  })

  it('rejects missing or malformed values', () => {
    expect(() => validateContactUpdate({ correo: 'a@b.es' })).toThrow(/--movil/)
    expect(() =>
      validateContactUpdate({ movil: '12345', correo: 'a@b.es' }),
    ).toThrow(/--movil/)
    expect(() =>
      validateContactUpdate({ movil: '600111222', correo: 'nope' }),
    ).toThrow(/--correo/)
    expect(() =>
      validateContactUpdate({
        movil: '600111222',
        correo: 'a@b.es',
        fijo: '1',
      }),
    ).toThrow(/--fijo/)
  })
})
