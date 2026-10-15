import { describe, expect, it } from 'vitest'

import { parseExpedienteCards } from './parseExpedienteCards'

const card = (index: number, procedimiento: string): string => `
<a class="cj-card cj-card--violet" href="https://carpeta.justicia.es/group/guest/expedientes?p_p_id=x&amp;_carjusmisprocedimientosmodule_idExpediente=${String(index)}&amp;_carjusmisprocedimientosmodule_fromBusqueda=1">
  <span class="cj-card__block">
    <span class="cj-card__text cj-card__key">Procedimiento: </span>
    <span class="cj-card__text cj-card__val">${procedimiento}</span>
  </span>
  <span class="cj-card__block">
    <span class="cj-card__text cj-card__key">&Oacute;rgano: </span>
    <span class="cj-card__text cj-card__val">PLAZA N&ordm; 1 - EJEMPLO</span>
  </span>
  <span class="cj-card__block">
    <span class="cj-card__text cj-card__key">Estado: </span>
    <span class="cj-card__text cj-card__val">TRAMITE                       </span>
  </span>
  <span class="cj-card__block">
    <span class="cj-card__text cj-card__key">Fecha de estado: </span>
    <span class="cj-card__text cj-card__val">05/05/2026 00:00:00</span>
  </span>
  <span class="cj-card__block">
    <span class="cj-card__text cj-card__key">NIG: </span>
    <span class="cj-card__text cj-card__val">1000000000000000001</span>
  </span>
</a>`

describe('parseExpedienteCards', () => {
  it('reads each card with its list index, trimming the padded estado', () => {
    const cards = parseExpedienteCards(
      `<div>${card(0, 'LEV 0000001/2022')}${card(1, 'MON 0000002/2026')}</div>`,
    )

    expect(cards).toHaveLength(2)
    expect(cards[1]).toEqual({
      index: 1,
      procedimiento: 'MON 0000002/2026',
      organo: 'PLAZA Nº 1 - EJEMPLO',
      estado: 'TRAMITE',
      fechaEstado: '05/05/2026 00:00:00',
      provincia: '',
      localidad: '',
      nig: '1000000000000000001',
    })
  })

  it('skips anchors that are not expediente cards', () => {
    expect(parseExpedienteCards('<a class="cj-card">no fields</a>')).toEqual([])
  })
})
