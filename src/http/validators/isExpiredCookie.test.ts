import { describe, expect, it } from 'vitest'

import { isExpiredCookie } from './isExpiredCookie'

const now = Date.parse('2026-01-01T00:00:00Z')

describe('isExpiredCookie', () => {
  it('reads a past Expires or a non-positive Max-Age as a deletion', () => {
    expect(isExpiredCookie([' Expires=Thu, 01-Dec-94 16:00:00 GMT'], now)).toBe(
      true,
    )
    expect(isExpiredCookie([' Max-Age=0'], now)).toBe(true)
    expect(isExpiredCookie([' max-age=-1'], now)).toBe(true)
  })

  it('keeps future, unparseable and absent expiry', () => {
    expect(
      isExpiredCookie([' Expires=Fri, 01-Jan-2100 00:00:00 GMT'], now),
    ).toBe(false)
    expect(isExpiredCookie([' Expires=soon'], now)).toBe(false)
    expect(isExpiredCookie([' Max-Age=60', ' Path=/'], now)).toBe(false)
    expect(isExpiredCookie([], now)).toBe(false)
  })
})
