import { describe, expect, it } from 'vitest'

import { carpetaAcceptPage } from '../fixtures/carpetaAcceptPage'
import { selectAcceptButton } from './selectAcceptButton'

describe('selectAcceptButton', () => {
  it('picks the Aceptar inside the confirmation panel, not "Firmar documento"', () => {
    expect(selectAcceptButton(carpetaAcceptPage)).toBe('form:j_id7')
  })

  it('answers undefined without the panel or its button', () => {
    expect(selectAcceptButton('<p/>')).toBeUndefined()
    expect(
      selectAcceptButton(
        '<div id="x:panelAceptar1"><input type="image" src="bt_cancelar.gif" name="c"/></div>',
      ),
    ).toBeUndefined()
  })
})
