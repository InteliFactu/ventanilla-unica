import { describe, expect, it } from 'vitest'

import { readShownStrings } from './readShownStrings'

describe('readShownStrings', () => {
  it('reads literal and hex runs in order, ignoring strings no Tj shows', () => {
    const content =
      '/Im1 Do (not shown) BT (10004 CACERES \\(CACERES\\)) Tj <4EDA> Tj ET'

    expect(readShownStrings(content)).toEqual(['10004 CACERES (CACERES)', 'NÚ'])
  })
})
