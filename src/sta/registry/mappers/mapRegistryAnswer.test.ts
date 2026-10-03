import { describe, expect, it } from 'vitest'

import { mapRegistryAnswer } from './mapRegistryAnswer'

describe('mapRegistryAnswer', () => {
  it('reads the registry number, date and CSV', () => {
    expect(
      mapRegistryAnswer('ref', {
        id: '20260840512',
        date: '2026-10-03T17:36:24.955Z',
        document: { cud: 'A11002926LMYLAE6JZLK' },
      }),
    ).toEqual({
      reference: 'ref',
      registryNumber: '20260840512',
      registeredAt: '2026-10-03T17:36:24.955Z',
      csv: 'A11002926LMYLAE6JZLK',
    })
  })

  it('treats the null answer of an unregistered save as an error', () => {
    expect(() =>
      mapRegistryAnswer('ref', { id: 'ref', date: null, document: null }),
    ).toThrow('the registry did not register the request')
  })
})
