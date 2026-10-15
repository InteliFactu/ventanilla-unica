import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../fixtures/buildTestIdentity'
import { validateKeyType } from './validateKeyType'

describe('validateKeyType', () => {
  const identity = buildTestIdentity()

  it('accepts the certificate family or no family at all', () => {
    expect(() => {
      validateKeyType(identity, { digest: 'sha256', keyType: 'rsa' })
      validateKeyType(identity, { digest: 'sha256', keyType: undefined })
    }).not.toThrow()
  })

  it('refuses another family', () => {
    expect(() => {
      validateKeyType(identity, { digest: 'sha256', keyType: 'ec' })
    }).toThrow('the certificate key is rsa')
  })
})
