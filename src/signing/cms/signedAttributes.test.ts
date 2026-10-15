import { X509Certificate } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { readCertificateParts } from '../asn1/parsers/readCertificateParts'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { cmsOids } from './cmsOids'
import { signedAttributes } from './signedAttributes'

describe('signedAttributes', () => {
  it('lists contentType, messageDigest and signingCertificateV2, without signingTime', () => {
    const parts = readCertificateParts(
      new X509Certificate(buildTestIdentity().cert).raw,
    )
    const digest = Buffer.alloc(32, 7)
    const attributes = signedAttributes(digest, parts, 'sha256')
    expect(attributes).toHaveLength(3)
    expect(attributes[0]?.includes(derOid(cmsOids.contentType))).toBe(true)
    expect(attributes[1]?.includes(digest)).toBe(true)
    expect(attributes[2]?.includes(derOid(cmsOids.signingCertificateV2))).toBe(
      true,
    )
    expect(
      attributes.some((item) => item.includes(derOid('1.2.840.113549.1.9.5'))),
    ).toBe(false)
  })
})
