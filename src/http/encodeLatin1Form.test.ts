import { describe, expect, it } from 'vitest'

import { encodeLatin1Form } from './encodeLatin1Form'

describe('encodeLatin1Form', () => {
  it('encodes values as ISO-8859-1 bytes the way a browser posts them', () => {
    expect(
      encodeLatin1Form({ 'method:x': 'a b', t: 'Secretaría <&>', z: '*-._~' }),
    ).toBe('method%3Ax=a+b&t=Secretar%EDa+%3C%26%3E&z=*-._%7E')
  })
  it('keeps a binary string byte for byte', () => {
    expect(encodeLatin1Form({ x: '\u0000ÿ' })).toBe('x=%00%FF')
  })
})
