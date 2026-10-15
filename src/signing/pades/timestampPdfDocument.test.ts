import { createHash } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../fixtures/buildTestIdentity'
import { answerTestTimestamp } from '../tsp/fixtures/answerTestTimestamp'
import { buildClassicPdf } from './fixtures/buildClassicPdf'
import { extractSignedParts } from './fixtures/extractSignedParts'
import { verifyDetachedCms } from './fixtures/verifyDetachedCms'
import { signPdf } from './signPdf'
import { timestampPdfDocument } from './timestampPdfDocument'

describe('timestampPdfDocument', () => {
  it('adds a /DocTimeStamp whose token stamps the byte range, and stays signable', async () => {
    const stamped = await timestampPdfDocument(
      buildClassicPdf(),
      { url: 'https://tsa.example.test/tsr' },
      answerTestTimestamp,
    )
    const text = stamped.toString('latin1')
    expect(text).toContain('/Type /DocTimeStamp')
    expect(text).toContain('/SubFilter /ETSI.RFC3161')
    expect(text).not.toContain('/Name ()')
    const parts = extractSignedParts(stamped)
    const imprint = createHash('sha512').update(parts.content).digest()
    expect(parts.cms.includes(imprint)).toBe(true)
    const identity = buildTestIdentity()
    const signed = extractSignedParts(signPdf(identity, stamped))
    expect(verifyDetachedCms(signed.cms, signed.content, identity.cert)).toBe(
      true,
    )
  })
})
