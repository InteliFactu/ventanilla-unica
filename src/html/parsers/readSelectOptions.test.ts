import { describe, expect, it } from 'vitest'

import { readSelectOptions } from './readSelectOptions'

describe('readSelectOptions', () => {
  const html =
    '<select name="other"><option value="x">X</option></select>' +
    '<select name="tipoComunidad" id="t"><option value="00">Seleccione</option>' +
    '<option value="ES43">EXTREMADURA</option>\n<option value="ES61">ANDALUC&Iacute;A </option></select>'

  it('reads value and decoded label of the named select', () => {
    expect(readSelectOptions(html, 'tipoComunidad')).toEqual([
      { value: '00', label: 'Seleccione' },
      { value: 'ES43', label: 'EXTREMADURA' },
      { value: 'ES61', label: 'ANDALUCÍA' },
    ])
  })

  it('answers no options for a missing select', () => {
    expect(readSelectOptions(html, 'provincia')).toEqual([])
  })
})
