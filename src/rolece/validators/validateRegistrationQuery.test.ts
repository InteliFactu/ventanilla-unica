import { describe, expect, it } from 'vitest'

import { validateRegistrationQuery } from './validateRegistrationQuery'

const valid = {
  nif: 'b-00000000',
  comunidad: 'Extremadura',
  provincia: 'Cáceres',
  email: 'info@example.com',
}

describe('validateRegistrationQuery', () => {
  it('normalises the NIF and defaults the applicant address to the company one', () => {
    expect(validateRegistrationQuery(valid)).toMatchObject({
      nif: 'B00000000',
      email: 'info@example.com',
      emailSolicitante: 'info@example.com',
    })
  })

  it('refuses a person, a bad NIF, missing places and bad addresses', () => {
    expect(() =>
      validateRegistrationQuery({ ...valid, nif: '00000000T' }),
    ).toThrow("not a legal entity's NIF")
    expect(() =>
      validateRegistrationQuery({ ...valid, nif: 'B00000001' }),
    ).toThrow('is not valid')
    expect(() =>
      validateRegistrationQuery({ ...valid, nif: undefined }),
    ).toThrow('--nif is required')
    expect(() =>
      validateRegistrationQuery({ ...valid, comunidad: ' ' }),
    ).toThrow('--comunidad')
    expect(() =>
      validateRegistrationQuery({ ...valid, provincia: undefined }),
    ).toThrow('--provincia')
    expect(() =>
      validateRegistrationQuery({ ...valid, 'email-solicitante': 'nope' }),
    ).toThrow('--email-solicitante')
    expect(() =>
      validateRegistrationQuery({ ...valid, email: undefined }),
    ).toThrow('--email must')
  })
})
