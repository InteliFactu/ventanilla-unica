import { describe, expect, it } from 'vitest'

import { signingFixtures } from '../fixtures/signingFixtures'
import { assertSignerRepresents } from './assertSignerRepresents'

const { document, nif } = signingFixtures

describe('assertSignerRepresents', () => {
  it('accepts the sender acting for the operator', () => {
    expect(() => {
      assertSignerRepresents(document, 'CN=00000000T TEST (R: B00000000)', nif)
    }).not.toThrow()
  })
  it('refuses another person or a certificate for another company', () => {
    expect(() => {
      assertSignerRepresents(document, 'CN=11111111H (R: B00000000)', nif)
    }).toThrow('is not 00000000T acting for B00000000')
    expect(() => {
      assertSignerRepresents(document, 'CN=00000000T TEST', nif)
    }).toThrow('nothing was signed')
  })
})
