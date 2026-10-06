import { describe, expect, it } from 'vitest'

import { selectInputEndingWith } from './selectInputEndingWith'

describe('selectInputEndingWith', () => {
  it('finds the input under any form id', () => {
    const html =
      '<input name="j_id9:imprimiracuse"/><input name="j_id9:imprimirnot"/>'
    expect(selectInputEndingWith(html, 'imprimirnot')).toBe('j_id9:imprimirnot')
    expect(selectInputEndingWith(html, 'other')).toBeUndefined()
  })
})
