import { describe, expect, it } from 'vitest'

import { parseAutoScriptAlgorithm } from './parseAutoScriptAlgorithm'

describe('parseAutoScriptAlgorithm', () => {
  it.each([
    ['SHA256withRSA', 'sha256', 'rsa'],
    ['SHA1withRSA', 'sha1', 'rsa'],
    ['sha512withrsa', 'sha512', 'rsa'],
    ['SHA384withECDSA', 'sha384', 'ec'],
    ['sha256', 'sha256', undefined],
    ['SHA-512', 'sha512', undefined],
  ])('reads %s', (value, digest, keyType) => {
    expect(parseAutoScriptAlgorithm(value)).toEqual({ digest, keyType })
  })

  it.each(['MD5withRSA', 'SHA256withDSA', 'NONEwithRSA', ''])(
    'refuses %s',
    (value) => {
      expect(() => parseAutoScriptAlgorithm(value)).toThrow(
        /unsupported AutoScript algorithm/,
      )
    },
  )
})
