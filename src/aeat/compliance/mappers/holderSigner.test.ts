import { describe, expect, it } from 'vitest'

import { holderSigner } from './holderSigner'

const screen =
  '<script>var _fbNombre="ACME SL"; var _fbNif="B00000000";</script>'

describe('holderSigner', () => {
  it('signs with the pre-filled identity when it is --nif', () => {
    expect(holderSigner('b00000000')(screen)).toEqual({
      nif: 'B00000000',
      nombre: 'ACME SL',
    })
  })

  it('refuses a certificate that acts for another holder', () => {
    expect(() => holderSigner('A11111111')(screen)).toThrow(
      /acts for B00000000, not for --nif A11111111/,
    )
  })
})
