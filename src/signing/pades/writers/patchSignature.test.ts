import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../fixtures/buildTestIdentity'
import { extractSignedParts } from '../fixtures/extractSignedParts'
import { verifyDetachedCms } from '../fixtures/verifyDetachedCms'
import { patchSignature } from './patchSignature'

describe('patchSignature', () => {
  const identity = buildTestIdentity()
  const file = (hexBytes: number) =>
    Buffer.from(
      `head /ByteRange [0 0000000000 0000000000 0000000000] /Contents <${'0'.repeat(hexBytes * 2)}> tail`,
      'latin1',
    )

  it('patches the byte range and signs everything around /Contents', () => {
    const patched = patchSignature(file(8192), identity, 0, {
      digest: 'sha256',
    })
    const parts = extractSignedParts(patched)
    expect(parts.byteRange[0]).toBe(0)
    expect((parts.byteRange[2] ?? 0) + (parts.byteRange[3] ?? 0)).toBe(
      patched.length,
    )
    expect(verifyDetachedCms(parts.cms, parts.content, identity.cert)).toBe(
      true,
    )
  })

  it('refuses a missing placeholder or one too small for the CMS', () => {
    expect(() =>
      patchSignature(Buffer.from('nothing'), identity, 0, {
        digest: 'sha256',
      }),
    ).toThrow(/placeholders not found/)
    expect(() =>
      patchSignature(file(16), identity, 0, { digest: 'sha256' }),
    ).toThrow(/larger than/)
  })
})
