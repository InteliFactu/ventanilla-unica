import { describe, expect, it } from 'vitest'

import { decodePdfLiteral } from './decodePdfLiteral'

describe('decodePdfLiteral', () => {
  it('resolves quoted, named and octal escapes', () => {
    expect(decodePdfLiteral(String.raw`a\(b\)\\c\td\341`)).toBe('a(b)\\c\tdá')
  })

  it('drops a backslash line continuation', () => {
    expect(decodePdfLiteral('one\\\ntwo')).toBe('onetwo')
  })

  it('keeps an unknown escaped character as itself', () => {
    expect(decodePdfLiteral(String.raw`\q`)).toBe('q')
  })
})
