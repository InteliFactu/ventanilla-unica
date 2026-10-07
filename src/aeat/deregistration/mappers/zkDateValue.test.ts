import { describe, expect, it } from 'vitest'

import { zkDateValue } from './zkDateValue'

describe('zkDateValue', () => {
  it('encodes a date as the ZK client does, at noon UTC', () => {
    expect(zkDateValue('05/09/2026')).toBe('2026.9.5.12.0.0.0')
  })
})
