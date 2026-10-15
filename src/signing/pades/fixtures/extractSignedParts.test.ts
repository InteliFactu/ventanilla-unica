import { describe, expect, it } from 'vitest'

import { extractSignedParts } from './extractSignedParts'

describe('extractSignedParts', () => {
  it('splits the byte ranges and cuts the CMS at its DER length, keeping a final zero', () => {
    const head = 'ab/ByteRange [0 0000000051 0000000061 0000000002] x'
    const pdf = Buffer.from(`${head}<30020B00>zz`, 'latin1')
    expect(head.length).toBe(51)
    const parts = extractSignedParts(pdf)
    expect(parts.byteRange).toEqual([0, 51, 61, 2])
    expect(parts.cms).toEqual(Buffer.from([0x30, 0x02, 0x0b, 0x00]))
    expect(parts.content.toString('latin1')).toBe(`${head}zz`)
  })
})
