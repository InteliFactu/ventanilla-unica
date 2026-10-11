import { describe, expect, it } from 'vitest'

import { cookiePath } from './cookiePath'

describe('cookiePath', () => {
  it('reads an explicit Path and falls back to the root', () => {
    expect(cookiePath([' Path=/es ', ' HttpOnly'])).toBe('/es')
    expect(cookiePath([' path=/'])).toBe('/')
    expect(cookiePath([' Secure'])).toBe('/')
    expect(cookiePath([' Path=relative'])).toBe('/')
  })
})
