import { describe, expect, it } from 'vitest'

import { isPendingNotification } from './isPendingNotification'

describe('isPendingNotification', () => {
  it('matches only Pendiente', () => {
    expect(isPendingNotification({ status: 'Pendiente' })).toBe(true)
    expect(isPendingNotification({ status: 'Notificado' })).toBe(false)
    expect(isPendingNotification({})).toBe(false)
  })
})
