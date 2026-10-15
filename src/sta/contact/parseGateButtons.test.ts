import { describe, expect, it } from 'vitest'

import { gateButtonHtml } from './fixtures/gateButtonHtml'
import { parseGateButtons } from './parsers/parseGateButtons'
import { selectGateStep } from './selectors/selectGateStep'

describe('parseGateButtons and selectGateStep', () => {
  it('reads each button and picks the confirming one, never NO', () => {
    const html =
      gateButtonHtml('PERSCONTACT', 'PERSCONTACT_NO', 'NO') +
      gateButtonHtml('PERSCONTACT', 'PERSCONTACT_YES', 'SÍ')
    const buttons = parseGateButtons(html)
    expect(buttons).toEqual([
      {
        screenId: 'DATOS_PERSONALES',
        object: 'PERSCONTACT',
        action: 'PERSCONTACT_NO',
        label: 'NO',
      },
      {
        screenId: 'DATOS_PERSONALES',
        object: 'PERSCONTACT',
        action: 'PERSCONTACT_YES',
        label: 'SÍ',
      },
    ])
    expect(selectGateStep(buttons)?.action).toBe('PERSCONTACT_YES')
  })

  it('accepts the identification data and stops when nothing is left', () => {
    const accept = parseGateButtons(
      gateButtonHtml('PERSCONTACT', 'PERSCONTACT_MOD', 'Modificar') +
        gateButtonHtml('PERSIDENT', 'PERSIDENT_OK', 'Aceptar'),
    )
    expect(selectGateStep(accept)?.action).toBe('PERSIDENT_OK')
    expect(selectGateStep(parseGateButtons('<p>Hecho</p>'))).toBeUndefined()
  })

  it('reads the sede.oargt.es variant, with a style attribute and a wrapping span', () => {
    const html = `<a class="boton-style tamano-defecto " href="#" onclick="if (jQuery(this).hasClass('disabled')) {return false;} else {if(validateForm(this)){callWidgetEventExecuteOn('DATOS_PERSONALES', 'PERSCONTACT', 'PERSCONTACT_YES', '', '','');};return false;}"\n\t\t   style=""\n\t\t   >\n\t\t\t<span>\n\t\t\t\t<span class="a-text">Sí</span>\n\t\t\t</span>\n\t\t</a>`
    expect(selectGateStep(parseGateButtons(html))?.action).toBe(
      'PERSCONTACT_YES',
    )
  })
})
