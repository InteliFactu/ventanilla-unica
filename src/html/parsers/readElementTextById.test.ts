import { describe, expect, it } from 'vitest'

import { readElementTextById } from './readElementTextById'

describe('readElementTextById', () => {
  const html =
    '<div><span class="negrita">Correo: </span><span id="f:t:correo">ana@example.org</span></div><span id="f:t:tlf2"> </span><span id="f:t:dir">CALLE &Ntilde;</span>'

  it('reads the decoded text of the element with that id', () => {
    expect(readElementTextById(html, 'f:t:correo')).toBe('ana@example.org')
    expect(readElementTextById(html, 'f:t:dir')).toBe('CALLE Ñ')
  })

  it('answers null for a blank element or a missing id', () => {
    expect(readElementTextById(html, 'f:t:tlf2')).toBeNull()
    expect(readElementTextById(html, 'f:t:mvl')).toBeNull()
  })
})
