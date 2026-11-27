import { describe, expect, it } from 'vitest'

import { parsePaymentRows } from './parsePaymentRows'

const link = (nrc: string): string =>
  `<a target='_blank' href='https://www1.agenciatributaria.gob.es/wlpl/OVPP-PAGO/ImpresionPDF?nrc=${nrc}'>Descargar</a>`

const html = `
<table>
<tr><th>Tipo</th><th>Modelo/Ej/Periodo</th><th>Nº Justificante</th><th>Importe</th><th>Entidad</th><th>Fecha</th><th></th></tr>
<tr><td>Autoliquid.</td><td>130/2025/1T</td><td>-</td><td>1.224,54 €</td><td>2100</td><td>21/04/2025</td><td>${link('1305300000001ABCDEFGHI')}</td></tr>
<tr><td>Liquidación</td><td>002</td><td>1026110000002</td><td>256,88 €</td><td>2100</td><td>05/06/2026</td><td>${link('1026110000002JKLMNOPQR')}</td></tr>
<tr><td>Liquidación</td><td>002</td><td>1026110000002</td><td>256,88 €</td><td>2100</td><td>05/06/2026</td><td>${link('1026110000002JKLMNOPQR')}</td></tr>
<tr><td>Tasa</td><td>791</td><td>7915000000003</td><td>55,70 \u0080</td><td>0049</td><td>10/06/2026</td><td>${link('7915000000003STUVWXYZA')}</td></tr>
<tr><td colspan="7">Sin enlace</td></tr>
</table>
`

describe('parsePaymentRows', () => {
  it('reads every payment row once, with the full NRC from the link and the justificante from it when the cell is a dash', () => {
    const rows = parsePaymentRows(html)

    expect(rows).toHaveLength(3)
    expect(rows[0]).toEqual({
      tipo: 'Autoliquid.',
      modelo: '130',
      ejercicio: '2025',
      periodo: '1T',
      justificante: '1305300000001',
      nrc: '1305300000001ABCDEFGHI',
      importe: { text: '1.224,54', amount: 1224.54 },
      entidad: '2100',
      fecha: '2025-04-21',
    })
    expect(rows[1]?.modelo).toBe('002')
    expect(rows[1]?.ejercicio).toBeUndefined()
    expect(rows[2]?.importe).toEqual({ text: '55,70', amount: 55.7 })
  })

  it('answers an empty list on a page without payments', () => {
    expect(parsePaymentRows('<table><tr><td>Nada</td></tr></table>')).toEqual(
      [],
    )
  })

  it.each([
    [
      'reordered amount and date',
      '<td>21/04/2025</td><td>2100</td><td>1.224,54 €</td>',
    ],
    [
      'unparseable amount',
      '<td>1.224,54 unknown</td><td>2100</td><td>21/04/2025</td>',
    ],
    [
      'nonexistent payment date',
      '<td>1.224,54 €</td><td>2100</td><td>29/02/2025</td>',
    ],
  ])('refuses a payment row with %s', (_reason, cells) => {
    const changed = html.replace(
      '<td>1.224,54 €</td><td>2100</td><td>21/04/2025</td>',
      cells,
    )
    expect(() => parsePaymentRows(changed)).toThrow(
      'AEAT: MisPagos returned a payment with an invalid amount or date',
    )
  })
})
