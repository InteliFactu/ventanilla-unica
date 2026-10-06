import { describe, expect, it } from 'vitest'

import { carpetaListPage } from '../fixtures/carpetaListPage'
import { selectFormWithInput } from './selectFormWithInput'

const base = 'https://sede.gobex.es/SEDE/privado/ciudadanos/Notificaciones.jsf'

describe('selectFormWithInput', () => {
  it('returns the form holding the input, with every button dropped', () => {
    const html = `<form id="o" action="other.jsf"><input type="hidden" name="o" value="o"/></form>${carpetaListPage([], { panel: true })}`
    expect(selectFormWithInput(html, base, 'f:imprimirnot')).toEqual({
      action: base,
      fields: { f: 'f', 'javax.faces.ViewState': 'state-1' },
    })
  })

  it('answers undefined when no form holds it', () => {
    expect(selectFormWithInput(carpetaListPage([]), base, 'g')).toBeUndefined()
  })
})
