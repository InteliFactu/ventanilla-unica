import { describe, expect, it } from 'vitest'

import { validateContactEmailQuery } from './validateContactEmailQuery'

describe('validateContactEmailQuery', () => {
  it('normalises the handle', () => {
    expect(
      validateContactEmailQuery({
        identificador: ' 1a2b-esnic-f5 ',
        email: 'a@b.es',
      }),
    ).toEqual({ identificador: '1A2B-ESNIC-F5', email: 'a@b.es' })
  })

  it('refuses a malformed handle or email', () => {
    expect(() =>
      validateContactEmailQuery({ identificador: 'X', email: 'a@b.es' }),
    ).toThrow('--identificador')
    expect(() =>
      validateContactEmailQuery({
        identificador: '1A-ESNIC-F5',
        email: 'nope',
      }),
    ).toThrow('--email')
    expect(() => validateContactEmailQuery({})).toThrow('--identificador')
  })
})
