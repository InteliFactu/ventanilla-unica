import { describe, expect, it } from 'vitest'

import { requireOption } from './requireOption'

const html =
  '<select name="provinciaSimpli"><option value="00">Seleccione una opción ...</option><option value="ES431">BADAJOZ</option><option value="ES432">CACERES</option></select>'

describe('requireOption', () => {
  it('picks the named option', () => {
    expect(requireOption(html, 'provinciaSimpli', 'cáceres')).toEqual({
      value: 'ES432',
      label: 'CACERES',
    })
  })

  it('lists the choices for an unknown name, never the placeholder', () => {
    expect(() =>
      requireOption(html, 'provinciaSimpli', 'Seleccione una opción ...'),
    ).toThrow('choices: BADAJOZ, CACERES')
    expect(() => requireOption(html, 'tipoComunidad', 'x')).toThrow(
      'none on the page',
    )
  })
})
