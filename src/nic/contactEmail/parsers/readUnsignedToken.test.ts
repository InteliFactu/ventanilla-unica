import { describe, expect, it } from 'vitest'

import { readUnsignedToken } from './readUnsignedToken'

describe('readUnsignedToken', () => {
  it('reads the hidden token', () => {
    expect(
      readUnsignedToken(
        '<textarea name="unsignedData" id="unsignedData">\n abc123 </textarea>',
      ),
    ).toBe('abc123')
  })

  it('throws when the form has no token', () => {
    expect(() => readUnsignedToken('<form></form>')).toThrow('no token')
  })
})
