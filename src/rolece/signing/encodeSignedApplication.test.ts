import { describe, expect, it } from 'vitest'

import { encodeSignedApplication } from './encodeSignedApplication'

describe('encodeSignedApplication', () => {
  it('declares and writes ISO-8859-1', () => {
    const out = encodeSignedApplication(
      Buffer.from('<?xml version="1.0" encoding="UTF-8"?>\n<a>í</a>'),
    )
    expect(out.toString('latin1')).toBe(
      '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>\n<a>í</a>',
    )
    expect(out.at(-5)).toBe(0xed)
  })
  it('refuses a document without the signer declaration', () => {
    expect(() => encodeSignedApplication(Buffer.from('<a/>'))).toThrow(
      'expected declaration',
    )
  })
})
