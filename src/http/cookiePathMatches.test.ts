import { describe, expect, it } from 'vitest'

import { cookiePathMatches } from './cookiePathMatches'

describe('cookiePathMatches', () => {
  it('matches the same path and paths below it on a slash boundary', () => {
    expect(cookiePathMatches('/es', '/es')).toBe(true)
    expect(cookiePathMatches('/es/mi_dgt/', '/es')).toBe(true)
    expect(cookiePathMatches('/es/mi_dgt/', '/es/')).toBe(true)
    expect(cookiePathMatches('/estado', '/es')).toBe(false)
    expect(cookiePathMatches('/system/a.jsp', '/es')).toBe(false)
    expect(cookiePathMatches('/anything', '/')).toBe(true)
  })
})
