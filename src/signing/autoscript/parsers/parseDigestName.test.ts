import { describe, expect, it } from 'vitest'

import { parseDigestName } from './parseDigestName'

describe('parseDigestName', () => {
  it.each([
    ['SHA-256', 'sha256'],
    ['sha1', 'sha1'],
    ['SHA512', 'sha512'],
    ['http://www.w3.org/2001/04/xmlenc#sha512', 'sha512'],
    ['http://www.w3.org/2001/04/xmldsig-more#sha384', 'sha384'],
    ['http://www.w3.org/2000/09/xmldsig#sha1', 'sha1'],
  ])('reads %s', (value, digest) => {
    expect(parseDigestName(value)).toBe(digest)
  })

  it('refuses MD5', () => {
    expect(() => parseDigestName('MD5')).toThrow(/unsupported digest/)
  })
})
