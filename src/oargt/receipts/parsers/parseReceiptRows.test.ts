import { describe, expect, it } from 'vitest'

import { parseReceiptRows } from './parseReceiptRows'

describe('parseReceiptRows', () => {
  it('maps a voluntaria row, folding otribdesc into the concept when present', () => {
    const rows = [
      {
        referen: '117',
        render_recnumber: '261243480-30-0',
        render_situacion: 'Voluntaria',
        intypename: 'Tasas',
        otribdesc: 'CL EJEMPLO 12',
        entityname: 'AYUNTAMIENTO DE EJEMPLO',
        importePrincipal: 158.24,
        importePendiente: '158.24',
        isDomiciliado: true,
        periodoVoluntarioReal: '20/07/2026&nbsp;-&nbsp;20/10/2026',
        accounyear: '2026 / 6',
        isCobrado: false,
      },
    ]
    expect(parseReceiptRows(rows, 'voluntaria')).toEqual([
      {
        tab: 'voluntaria',
        reference: '117',
        number: '261243480-30-0',
        concept: 'Tasas - CL EJEMPLO 12',
        entity: 'AYUNTAMIENTO DE EJEMPLO',
        principal: '158,24',
        pending: '158,24',
        principalNumber: 158.24,
        pendingNumber: 158.24,
        situation: 'Voluntaria',
        directDebit: true,
        enforced: false,
        voluntaryPeriod: '20/07/2026 - 20/10/2026',
        accountingPeriod: '2026 / 6',
        paid: false,
      },
    ])
  })

  it('marks a row enforced when it carries a paseje date, and drops an empty concept suffix', () => {
    const rows = [
      {
        referen: '6343HNW',
        render_situacion: 'Ejecutiva',
        intypename: 'IMPUESTO VEHICULOS TRACCION MECANICA REC',
        otribdesc: '',
        entityname: 'CACERES',
        importePrincipal: 140,
        importePendiente: '140.0',
        isDomiciliado: false,
        paseje: '23/06/2026',
        isCobrado: false,
      },
    ]
    const [receipt] = parseReceiptRows(rows, 'ejecutiva')
    expect(receipt?.concept).toBe('IMPUESTO VEHICULOS TRACCION MECANICA REC')
    expect(receipt?.enforced).toBe(true)
    expect(receipt?.number).toBeUndefined()
    expect(receipt?.voluntaryPeriod).toBeUndefined()
  })

  it('reads a paid row that passed through ejecutiva as enforced even on the pagados tab', () => {
    const rows = [
      {
        referen: '9753DVD',
        render_situacion: 'Ejecutiva',
        intypename: 'Impuesto de Vehiculos de Traccion Mecanica',
        entityname: 'CACERES',
        importePrincipal: 127,
        importePendiente: '0.0',
        isDomiciliado: true,
        paseje: '21/05/2016',
        isCobrado: true,
      },
    ]
    const [receipt] = parseReceiptRows(rows, 'pagados')
    expect(receipt?.tab).toBe('pagados')
    expect(receipt?.enforced).toBe(true)
    expect(receipt?.paid).toBe(true)
  })

  it('drops anything that is not a plain object', () => {
    expect(parseReceiptRows([null, 'x', 42, []], 'voluntaria')).toEqual([])
  })
})
