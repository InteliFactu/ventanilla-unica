import { describe, expect, it } from 'vitest'

import { registrationPageHtml } from '../fixtures/registrationPageHtml'
import { readAvailability } from './readAvailability'

describe('readAvailability', () => {
  it('reads a free e-mail', () => {
    expect(
      readAvailability(
        registrationPageHtml({ free: 'Id usuario y email permitidos.' }),
      ),
    ).toEqual({ account: 'none', message: 'Id usuario y email permitidos.' })
  })

  it('reads a taken e-mail, and nothing conclusive otherwise', () => {
    expect(
      readAvailability(registrationPageHtml({ email: 'El e-mail ya existe.' })),
    ).toEqual({ account: 'exists', message: 'El e-mail ya existe.' })
    expect(
      readAvailability(registrationPageHtml({ user: 'El usuario ya existe.' })),
    ).toEqual({ account: 'unknown', message: 'El usuario ya existe.' })
  })
})
