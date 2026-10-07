import { describe, expect, it } from 'vitest'

import { asciiJson } from './asciiJson'

describe('asciiJson', () => {
  it('escapes every non-ASCII character and parses back to the same value', () => {
    const value = { value: 'Disolución y liquidación, ÑANDÚ' }
    const text = asciiJson(value)
    expect(text).toBe(
      '{"value":"Disoluci\\u00f3n y liquidaci\\u00f3n, \\u00d1AND\\u00da"}',
    )
    expect(JSON.parse(text)).toEqual(value)
  })
})
