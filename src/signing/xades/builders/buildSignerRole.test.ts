import { describe, expect, it } from 'vitest'

import { renderTestElement } from '../fixtures/renderTestElement'
import { buildSignerRole } from './buildSignerRole'

describe('buildSignerRole', () => {
  it('claims every role', () => {
    expect(
      renderTestElement(buildSignerRole('xades', ['emisor', 'tercero'])),
    ).toBe(
      '<xades:SignerRole><xades:ClaimedRoles><xades:ClaimedRole>emisor</xades:ClaimedRole><xades:ClaimedRole>tercero</xades:ClaimedRole></xades:ClaimedRoles></xades:SignerRole>',
    )
  })
})
