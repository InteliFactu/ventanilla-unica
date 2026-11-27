import { describe, expect, it } from 'vitest'

import { parseDebtDetail } from './parseDebtDetail'

const detalleDdaPresentFixture = `
<html><body>
<h2>Datos generales</h2>
<table>
<tr><td>Fecha de liquidación:</td><td>03-05-2025</td></tr>
<tr><td>Importe de la deuda:</td><td>1.611,49</td></tr>
<tr><td>Total importes cancelados:</td><td>1.105,97</td></tr>
<tr><td>Importe deuda a ingresar:</td><td>639,26</td></tr>
<tr><td>Intereses:</td><td>12,40</td></tr>
<tr><td>Total a ingresar:</td><td>651,66</td></tr>
</table>
</body></html>
`

const detalleDdaAbsentFixture = `
<html><body>
<p>Consultar deudas</p>
<p>No hay informacion disponible para la clave indicada.</p>
</body></html>
`

describe('parseDebtDetail', () => {
  it('reads every labelled amount and date when Datos generales is present', () => {
    expect(parseDebtDetail(detalleDdaPresentFixture)).toEqual({
      fechaLiquidacion: '03-05-2025',
      importeDeuda: { text: '1.611,49', amount: 1611.49 },
      cancelado: { text: '1.105,97', amount: 1105.97 },
      principalHoy: { text: '639,26', amount: 639.26 },
      interesesHoy: { text: '12,40', amount: 12.4 },
      totalHoy: { text: '651,66', amount: 651.66 },
    })
  })

  it('returns undefined when Datos generales is absent, carrying no information', () => {
    expect(parseDebtDetail(detalleDdaAbsentFixture)).toBeUndefined()
  })

  it.each([':', ''])(
    'returns the visible voluntary deadline with the label suffix "%s"',
    (suffix) => {
      const detail = parseDebtDetail(`
      <h2>Datos generales</h2>
      <table>
        <tr hidden><td>Fecha límite ingreso en voluntaria:</td><td>20-11-2026</td></tr>
        <tr><td>Fecha l&iacute;mite ingreso en voluntaria${suffix}</td><td>20-08-2026</td></tr>
        <tr><td>Fecha límite de ingreso en apremio:</td><td>05-09-2026</td></tr>
      </table>
    `)
      expect(detail?.fechaLimiteVoluntaria).toBe('2026-08-20')
    },
  )

  it.each([
    ['missing', ''],
    ['not a calendar date', '30-02-2026'],
    [
      'contradictory',
      '20-08-2026 Fecha límite ingreso en voluntaria: 21-08-2026',
    ],
  ])('omits a voluntary deadline that is %s', (_example, voluntary) => {
    const detail = parseDebtDetail(`
      <h2>Datos generales</h2>
      <table>
        <tr><td>Fecha límite ingreso en voluntaria:</td><td>${voluntary}</td></tr>
        <tr><td>Fecha límite de ingreso en apremio:</td><td>05-09-2026</td></tr>
      </table>
    `)
    expect(detail).not.toHaveProperty('fechaLimiteVoluntaria')
  })
})
