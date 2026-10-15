import { describe, expect, it } from 'vitest'

import { placeByteRange } from './placeByteRange'
import { writeSignatureContents } from './writeSignatureContents'

describe('writeSignatureContents', () => {
  const file = (hexBytes: number) =>
    Buffer.from(
      `head /ByteRange [0 0000000000 0000000000 0000000000] /Contents <${'0'.repeat(hexBytes * 2)}> tail`,
      'latin1',
    )

  it('places the byte range around /Contents and writes the CMS in hex', () => {
    const prepared = placeByteRange(file(4), 0)
    const text = writeSignatureContents(prepared, Buffer.from([0xab])).toString(
      'latin1',
    )
    expect(text).toContain('/ByteRange [0 0000000063 0000000073 0000000005]')
    expect(text).toContain('/Contents <AB000000>')
  })

  it('refuses a missing placeholder or one too small for the CMS', () => {
    expect(() => placeByteRange(Buffer.from('nothing'), 0)).toThrow(
      /placeholders not found/,
    )
    expect(() =>
      writeSignatureContents(placeByteRange(file(1), 0), Buffer.alloc(2)),
    ).toThrow(/larger than/)
  })
})
