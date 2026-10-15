import { X509Certificate } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from './buildTestIdentity'

describe('buildTestIdentity', () => {
  it('builds a parseable self-signed certificate matching its key', () => {
    const identity = buildTestIdentity('FIXTURE')
    const certificate = new X509Certificate(identity.cert)
    expect(certificate.subject).toBe('CN=FIXTURE')
    expect(certificate.verify(certificate.publicKey)).toBe(true)
  })

  it('builds an EC P-256 one on request', () => {
    const certificate = new X509Certificate(
      buildTestIdentity(undefined, undefined, 'ec').cert,
    )
    expect(certificate.publicKey.asymmetricKeyDetails?.namedCurve).toBe(
      'prime256v1',
    )
    expect(certificate.verify(certificate.publicKey)).toBe(true)
  })
})
