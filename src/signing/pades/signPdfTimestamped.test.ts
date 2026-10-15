import { describe, expect, it } from 'vitest'

import { derOid } from '../asn1/derOid'
import { cmsOids } from '../cms/cmsOids'
import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { answerTestTimestamp } from '../tsp/fixtures/answerTestTimestamp'
import { buildClassicPdf } from './fixtures/buildClassicPdf'
import { extractSignedParts } from './fixtures/extractSignedParts'
import { verifyDetachedCms } from './fixtures/verifyDetachedCms'
import { signPdfTimestamped } from './signPdfTimestamped'

describe('signPdfTimestamped', () => {
  it('carries the TSA token inside a CMS that still verifies', async () => {
    const identity = buildTestIdentity()
    const signed = await signPdfTimestamped(
      identity,
      buildClassicPdf(),
      { timestamp: { url: 'https://tsa.example.test/tsr' } },
      answerTestTimestamp,
    )
    const parts = extractSignedParts(signed)
    expect(parts.cms.includes(derOid(cmsOids.signatureTimeStampToken))).toBe(
      true,
    )
    expect(verifyDetachedCms(parts.cms, parts.content, identity.cert)).toBe(
      true,
    )
  })
})
