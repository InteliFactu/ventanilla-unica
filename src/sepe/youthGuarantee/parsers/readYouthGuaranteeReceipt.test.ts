import { describe, expect, it } from 'vitest'

import { readYouthGuaranteeReceipt } from './readYouthGuaranteeReceipt'

describe('filing receipt evidence', () => {
  it.each(['pendiente', 'no', 'error', '00000000'])(
    'does not accept %s as a registry number',
    (value) => {
      expect(
        readYouthGuaranteeReceipt(`<p>Número de registro: ${value}</p>`),
      ).toMatchObject({ registered: false, registrationNumber: null })
    },
  )
  it('requires explicit submission confirmation as well as a registry identifier', () => {
    expect(
      readYouthGuaranteeReceipt('<p>Número de registro: TEST-2026-0001</p>'),
    ).toMatchObject({ registered: false })
  })
  it('recognizes an explicit confirmation and defensible registry identifier', () => {
    expect(
      readYouthGuaranteeReceipt(
        '<h1>Solicitud registrada correctamente</h1><p>Número de registro: TEST-2026-0001</p>',
      ),
    ).toMatchObject({ registered: true, registrationNumber: 'TEST-2026-0001' })
  })
})
