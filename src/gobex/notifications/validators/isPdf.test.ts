import { describe, expect, it } from 'vitest'

import { isPdf } from './isPdf'

describe('isPdf', () => {
  it('checks the magic', () => {
    expect(isPdf(Buffer.from('%PDF-1.4'))).toBe(true)
    expect(isPdf(Buffer.from('<?xml'))).toBe(false)
  })
})
