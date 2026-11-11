import { describe, expect, it } from 'vitest'

import { hasElementWithId } from './hasElementWithId'

describe('hasElementWithId', () => {
  it('finds an element of the tag by id, empty or not', () => {
    expect(
      hasElementWithId('<input id="movil" value="">', 'input', 'movil'),
    ).toBe(true)
  })

  it('ignores another tag, another id and a bare substring', () => {
    const html = '<span id="movil"></span><input id="movil2"><p>id="movil"</p>'
    expect(hasElementWithId(html, 'input', 'movil')).toBe(false)
  })
})
