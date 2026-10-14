import { X509Certificate } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { derUtcTime } from '../asn1/derUtcTime'
import { readCertificateParts } from '../asn1/parsers/readCertificateParts'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { cadesSignedAttributes } from './cadesSignedAttributes'
import { cmsOids } from './cmsOids'

describe('cadesSignedAttributes', () => {
  it('adds signingTime to the PAdES attribute set', () => {
    const parts = readCertificateParts(
      new X509Certificate(buildTestIdentity().cert).raw,
    )
    const time = new Date('2026-10-15T08:30:00Z')
    const attributes = cadesSignedAttributes(Buffer.alloc(32, 7), parts, time)
    expect(attributes).toHaveLength(4)
    const signingTime = attributes[3]
    expect(signingTime?.includes(derOid(cmsOids.signingTime))).toBe(true)
    expect(signingTime?.includes(derUtcTime(time))).toBe(true)
  })
})
