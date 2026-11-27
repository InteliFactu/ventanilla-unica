import { describe, expect, it } from 'vitest'

import { parsePendingNotificationPage } from './parsePendingNotificationPage'

describe('parsePendingNotificationPage', () => {
  it('maps pending items with the pending state and their expiration date', () => {
    const result = parsePendingNotificationPage({
      items: [
        {
          identifier: 'N271612747',
          concept: 'REGULARIZACION AUTONOMOS',
          emitterEntity: 'Tesoreria General de la Seguridad Social',
          availabilityDate: '2026-01-28T00:15:25+01:00',
          expirationDate: '2026-02-07T00:15:25+01:00',
          nifTitular: '12345678Z',
        },
      ],
    })
    expect(result).toEqual([
      {
        id: 'N271612747',
        subject: 'REGULARIZACION AUTONOMOS',
        issuer: 'Tesoreria General de la Seguridad Social',
        holderNif: '12345678Z',
        holderName: undefined,
        createdAt: '2026-01-28T00:15:25+01:00',
        expiresAt: '2026-02-07T00:15:25+01:00',
        state: 'pending',
        kind: undefined,
        source: 'tgss',
      },
    ])
  })

  it('returns an empty list only for an explicit empty array', () => {
    expect(parsePendingNotificationPage({ items: [] })).toEqual([])
    expect(() => parsePendingNotificationPage({})).toThrow('items array')
  })

  it('refuses a page that contains an invalid notification', () => {
    expect(() => parsePendingNotificationPage({ items: [{}] })).toThrow(
      'invalid notification',
    )
  })
})
