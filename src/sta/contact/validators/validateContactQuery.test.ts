import { describe, expect, it } from 'vitest'

import { validateContactQuery } from './validateContactQuery'

describe('validateContactQuery', () => {
  it('reads the e-mail and the phone', () => {
    expect(
      validateContactQuery({
        correo: ' a@example.es ',
        telefono: '600 000 000',
      }),
    ).toEqual({ email: 'a@example.es', phone: '600000000' })
  })

  it('requires an e-mail and a valid phone', () => {
    expect(() => validateContactQuery({ telefono: 'x' })).toThrow(
      '--correo must be an e-mail address; --telefono must be a phone number',
    )
  })
})
