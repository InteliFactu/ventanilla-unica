import { describe, expect, it } from 'vitest'

import { decodeJsUnicodeEscapes } from './decodeJsUnicodeEscapes'

describe('decodeJsUnicodeEscapes', () => {
  it('decodes \\uXXXX and leaves other text alone', () => {
    expect(decodeJsUnicodeEscapes(String.raw`Fotografías \x41`)).toBe(
      String.raw`Fotografías \x41`,
    )
  })
})
