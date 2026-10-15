import { describe, expect, it } from 'vitest'

import { parseExtraParams } from './parseExtraParams'

describe('parseExtraParams', () => {
  it('reads key=value and key:value lines, skipping comments and blanks', () => {
    const params = parseExtraParams(
      '# comment\nmode=implicit\r\n\n expPolicy = FirmaAGE \nsignReason:Tramite\n!x=y\nbroken',
    )
    expect([...params]).toEqual([
      ['mode', 'implicit'],
      ['expPolicy', 'FirmaAGE'],
      ['signReason', 'Tramite'],
    ])
  })

  it('is empty without text', () => {
    expect(parseExtraParams(undefined).size).toBe(0)
  })
})
