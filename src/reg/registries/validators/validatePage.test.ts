import { describe, expect, it } from 'vitest'

import { validatePage } from './validatePage'

describe('validatePage', () => {
  it('defaults to the first page and accepts a positive number', () => {
    expect(validatePage(undefined)).toBe(1)
    expect(validatePage('3')).toBe(3)
  })

  it('refuses anything else', () => {
    expect(() => validatePage('0')).toThrow('positive whole number')
    expect(() => validatePage('x')).toThrow('positive whole number')
  })
})
