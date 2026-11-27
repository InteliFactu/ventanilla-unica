import { describe, expect, it } from 'vitest'

import { isSpanishDate } from './isSpanishDate'

describe('isSpanishDate', () => {
  it('accepts a real calendar date as DD/MM/AAAA', () => {
    expect(isSpanishDate('01/01/2018')).toBe(true)
    expect(isSpanishDate('29/02/2024')).toBe(true)
  })

  it('rejects other formats and impossible dates', () => {
    expect(isSpanishDate('2018-01-01')).toBe(false)
    expect(isSpanishDate('31/02/2026')).toBe(false)
    expect(isSpanishDate('1/1/2026')).toBe(false)
  })
})
