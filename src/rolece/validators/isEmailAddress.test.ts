import { describe, expect, it } from 'vitest'

import { isEmailAddress } from './isEmailAddress'

describe('isEmailAddress', () => {
  it('accepts a plain address', () => {
    expect(isEmailAddress('info@example.com')).toBe(true)
  })

  it('refuses everything else', () => {
    for (const value of [
      '',
      'x',
      'a@b',
      'a@.b',
      'a@b.',
      '@b.es',
      'a b@c.es',
      'a@b@c.es',
    ])
      expect(isEmailAddress(value)).toBe(false)
  })
})
