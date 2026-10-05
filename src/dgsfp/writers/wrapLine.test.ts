import { describe, expect, it } from 'vitest'

import { wrapLine } from './wrapLine'

describe('wrapLine', () => {
  it('breaks at spaces and cuts a word longer than the line', () => {
    expect(wrapLine('uno dos tres', 7)).toEqual(['uno dos', 'tres'])
    expect(wrapLine('abcdefghij', 4)).toEqual(['abcd', 'efgh', 'ij'])
  })
})
