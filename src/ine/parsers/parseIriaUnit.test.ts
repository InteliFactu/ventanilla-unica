import { describe, expect, it } from 'vitest'

import { parseIriaUnit } from './parseIriaUnit'

describe('parseIriaUnit', () => {
  it('reads the company name and NIF of the selected unit', () => {
    const html =
      '<div class="card-header">Datos de la Unidad Seleccionada</div><div class="form-group"><span class="text-neutral-gray">Razón social: </span><span class="weight-bold bodyMh">VIBRA LAB, SL </span></div><div class="form-group"><span class="text-neutral-gray">NIF: </span><span class="weight-bold">B22903801 </span></div><div class="form-group"><span>Dirección: </span><span>CL SANTA CRISTINA 3</span></div>'
    expect(parseIriaUnit(html)).toEqual({
      razonSocial: 'VIBRA LAB, SL',
      nif: 'B22903801',
    })
  })

  it('is undefined without the unit header', () => {
    expect(parseIriaUnit('<p>nothing</p>')).toBeUndefined()
  })
})
