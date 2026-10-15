import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../fixtures/buildTestIdentity'
import { signData } from '../../signData'
import { parseCertificateChain } from '../parsers/parseCertificateChain'
import { assertSignatureVerifies } from './assertSignatureVerifies'

describe('assertSignatureVerifies', () => {
  const identity = buildTestIdentity()
  const { signer } = parseCertificateChain(identity.cert)
  const data = Buffer.from('signed info')
  it('accepts a signature made with the certificate key', () => {
    expect(() => {
      assertSignatureVerifies(
        signer,
        data,
        signData(identity, data, 'sha512'),
        'sha512',
      )
    }).not.toThrow()
  })
  it('refuses a signature made with another key', () => {
    const other = buildTestIdentity()
    expect(() => {
      assertSignatureVerifies(
        signer,
        data,
        signData(other, data, 'sha256'),
        'sha256',
      )
    }).toThrow('does not match the signing certificate')
  })
})
