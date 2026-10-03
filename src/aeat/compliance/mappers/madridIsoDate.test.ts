import { describe, expect, it } from 'vitest'

import { madridIsoDate } from './madridIsoDate'

describe('madridIsoDate', () => {
  it('dates an instant on the Madrid calendar, not UTC', () => {
    expect(madridIsoDate(new Date('2026-10-02T22:30:00Z'))).toBe('2026-10-03')
    expect(madridIsoDate(new Date('2026-01-15T12:00:00Z'))).toBe('2026-01-15')
  })
})
