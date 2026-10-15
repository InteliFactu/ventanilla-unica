import { describe, expect, it } from 'vitest'

import { parsePdfTimestamps } from './parsePdfTimestamps'

const tsa = 'https://tsa.example.test/tsr'

describe('parsePdfTimestamps', () => {
  it('stamps the signature by default, the document or both on request', () => {
    expect(parsePdfTimestamps(tsa, undefined)).toEqual({
      timestamp: { url: tsa },
    })
    expect(parsePdfTimestamps(tsa, 'documento')).toEqual({
      documentTimestamp: { url: tsa },
    })
    expect(parsePdfTimestamps(tsa, 'ambos')).toEqual({
      timestamp: { url: tsa },
      documentTimestamp: { url: tsa },
    })
    expect(parsePdfTimestamps(undefined, undefined)).toEqual({})
  })

  it('refuses --sello without --tsa and an unknown kind', () => {
    expect(() => parsePdfTimestamps(undefined, 'firma')).toThrow('needs --tsa')
    expect(() => parsePdfTimestamps(tsa, 'todo')).toThrow(
      'firma, documento or ambos',
    )
  })
})
