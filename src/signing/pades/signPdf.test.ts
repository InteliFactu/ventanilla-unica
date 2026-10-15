import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { agePolicyCms } from '../cms/agePolicyCms'
import { cmsOids } from '../cms/cmsOids'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { buildClassicPdf } from './fixtures/buildClassicPdf'
import { buildObjectStreamPdf } from './fixtures/buildObjectStreamPdf'
import { extractSignedParts } from './fixtures/extractSignedParts'
import { verifyDetachedCms } from './fixtures/verifyDetachedCms'
import { readPdfDocument } from './parsers/readPdfDocument'
import { signPdf } from './signPdf'

describe('signPdf', () => {
  const identity = buildTestIdentity('GARCIA ANA - 00000000T')

  it('signs classic and xref-stream PDFs by incremental update', () => {
    for (const original of [buildClassicPdf(), buildObjectStreamPdf()]) {
      const signed = signPdf(identity, original)
      expect(signed.subarray(0, original.length)).toEqual(original)
      const parts = extractSignedParts(signed)
      expect(verifyDetachedCms(parts.cms, parts.content, identity.cert)).toBe(
        true,
      )
      expect(readPdfDocument(signed).usesXrefStream).toBe(
        readPdfDocument(original).usesXrefStream,
      )
    }
  })

  it('signs with SHA-512 and the AGE policy when asked', () => {
    const signed = signPdf(identity, buildClassicPdf(), {
      digest: 'sha512',
      policy: agePolicyCms,
    })
    const parts = extractSignedParts(signed)
    expect(
      verifyDetachedCms(parts.cms, parts.content, identity.cert, 'sha512'),
    ).toBe(true)
    expect(parts.cms.includes(derOid(agePolicyCms.oid))).toBe(true)
  })

  it('draws a visible stamp and signs again on top of a signature', () => {
    const once = signPdf(identity, buildClassicPdf(), {
      visible: true,
      reason: 'Conforme',
      date: new Date(0),
    })
    expect(once.toString('latin1')).toContain(
      '(Firmado por GARCIA ANA - 00000000T) Tj',
    )
    const twice = signPdf(identity, once)
    const text = twice.toString('latin1')
    expect(text.match(/\/FT \/Sig/g)).toHaveLength(2)
    const parts = extractSignedParts(twice)
    expect(verifyDetachedCms(parts.cms, parts.content, identity.cert)).toBe(
      true,
    )
  })

  it('signs with an EC key as ecdsa-with-SHA256', () => {
    const ec = buildTestIdentity(undefined, undefined, 'ec')
    const parts = extractSignedParts(signPdf(ec, buildClassicPdf()))
    expect(verifyDetachedCms(parts.cms, parts.content, ec.cert)).toBe(true)
    expect(parts.cms.includes(derOid(cmsOids.ecdsaWithSha256))).toBe(true)
  })
})
