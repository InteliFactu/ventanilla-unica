import { describe, expect, it } from 'vitest'

import { pdfLiteral } from './pdfLiteral'

describe('pdfLiteral', () => {
  it('escapes delimiters and replaces what WinAnsi cannot show', () => {
    expect(pdfLiteral('a (b) \\ ñ €')).toBe('(a \\(b\\) \\\\ ñ ?)')
  })
})
