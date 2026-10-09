import { describe, expect, it } from 'vitest'

import { encodeLatin1Pairs } from './encodeLatin1Pairs'

describe('encodeLatin1Pairs', () => {
  it('keeps order and repeated names, in ISO-8859-1', () => {
    expect(
      encodeLatin1Pairs([
        ['tipo', 'A'],
        ['desc', 'Aportación de documentación'],
        ['tipo', 'A'],
      ]),
    ).toBe('tipo=A&desc=Aportaci%F3n+de+documentaci%F3n&tipo=A')
  })
})
