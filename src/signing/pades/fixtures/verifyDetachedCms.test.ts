import { createHash } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { derSequence } from '../../asn1/derSequence'
import { buildSignedData } from '../../cms/buildSignedData'
import { buildTestIdentity } from '../../fixtures/buildTestIdentity'
import { verifyDetachedCms } from './verifyDetachedCms'

describe('verifyDetachedCms', () => {
  const identity = buildTestIdentity()
  const content = Buffer.from('content')
  const cms = buildSignedData(
    identity,
    createHash('sha256').update(content).digest(),
    { digest: 'sha256' },
  )

  it('accepts the right content and rejects other content', () => {
    expect(verifyDetachedCms(cms, content, identity.cert)).toBe(true)
    expect(verifyDetachedCms(cms, Buffer.from('other'), identity.cert)).toBe(
      false,
    )
  })

  it('rejects something that is not a SignedData', () => {
    expect(verifyDetachedCms(derSequence([]), content, identity.cert)).toBe(
      false,
    )
  })
})
