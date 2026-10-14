import { describe, expect, it } from 'vitest'

import { readIriaMessages } from './readIriaMessages'

describe('readIriaMessages', () => {
  it('reads info and error summaries, unescaped', () => {
    const xml =
      '<partial-response><changes><update id="formTotal:pErrors"><![CDATA[<div class="ui-messages"><span class="ui-messages-info-summary">Se ha asignado correctamente la encuesta: Encuesta Anual de Estructura Salarial.</span><span class="ui-messages-error-summary">N&#250;mero de orden incorrecto</span><span class="ui-messages-warn-summary"> </span></div>]]></update></changes></partial-response>'
    expect(readIriaMessages(xml)).toEqual([
      'Se ha asignado correctamente la encuesta: Encuesta Anual de Estructura Salarial.',
      'Número de orden incorrecto',
    ])
  })
})
