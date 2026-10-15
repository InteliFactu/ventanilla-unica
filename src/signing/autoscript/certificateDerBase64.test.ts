import { X509Certificate } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { certificateDerBase64 } from './certificateDerBase64'

describe('certificateDerBase64', () => {
  it('returns the DER of the certificate block as one base64 line', () => {
    const identity = buildTestIdentity()
    const der = certificateDerBase64(identity)
    expect(der).not.toMatch(/\s/)
    expect(new X509Certificate(Buffer.from(der, 'base64')).subject).toContain(
      'VENTANILLA UNICA TEST',
    )
  })

  it('strips the Bag Attributes a PKCS#12 export puts around the block', () => {
    const identity = buildTestIdentity()
    const bagged = Buffer.from(
      `Bag Attributes\n    localKeyID: 01 02\nsubject=/CN=VENTANILLA UNICA TEST\n${identity.cert.toString('utf8')}`,
    )
    expect(certificateDerBase64({ ...identity, cert: bagged })).toBe(
      certificateDerBase64(identity),
    )
  })

  it('refuses a certificate without a PEM block', () => {
    expect(() =>
      certificateDerBase64({
        cert: Buffer.from('nothing'),
        key: Buffer.alloc(0),
      }),
    ).toThrow(/no PEM CERTIFICATE block/)
  })

  it('refuses an empty block', () => {
    const cert = Buffer.from(
      '-----BEGIN CERTIFICATE-----\n\n-----END CERTIFICATE-----',
    )
    expect(() => certificateDerBase64({ cert, key: Buffer.alloc(0) })).toThrow(
      /empty/,
    )
  })
})
