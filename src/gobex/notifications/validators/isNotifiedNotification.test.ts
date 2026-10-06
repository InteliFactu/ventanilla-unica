import { describe, expect, it } from 'vitest'

import { isNotifiedNotification } from './isNotifiedNotification'

describe('isNotifiedNotification', () => {
  it('matches only Notificado', () => {
    expect(isNotifiedNotification({ status: 'Notificado' })).toBe(true)
    expect(isNotifiedNotification({ status: 'Expirado' })).toBe(false)
    expect(isNotifiedNotification({})).toBe(false)
  })
})
