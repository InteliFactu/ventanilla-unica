import { describe, expect, it } from 'vitest'

import { readYouthGuaranteeDefaults } from './readYouthGuaranteeDefaults'

describe('readYouthGuaranteeDefaults', () => {
  it('sends what a browser sends for untouched controls', () => {
    const block = `<form name="solicitudPaso5">
      <input type="text" name="solicitante.linkedin" value="">
      <input type="radio" name="tengoExperiencia" value="Si" checked="checked">
      <input type="radio" name="tengoExperiencia" value="No">
      <input type="checkbox" name="checkConsentimiento" value="true">
      <input type="hidden" name="token" value="t">
      <input type="submit" name="siguiente" value="Siguiente">
      <select name="situacionSolicitante.tcodIngresos"><option value="-1">Seleccione</option><option value="2">2</option></select>
      <select name="situacionSolicitante.tcodTipoCarnet"><option value="0">Seleccione</option><option value="03" selected="selected">B</option></select>
      <select name="experienciaLaboral.tcodOcupacion" disabled="disabled"><option value="-1">x</option></select>
    </form>`
    expect(readYouthGuaranteeDefaults(block)).toEqual({
      'solicitante.linkedin': '',
      tengoExperiencia: 'Si',
      'situacionSolicitante.tcodIngresos': '-1',
      'situacionSolicitante.tcodTipoCarnet': '03',
    })
  })
})
