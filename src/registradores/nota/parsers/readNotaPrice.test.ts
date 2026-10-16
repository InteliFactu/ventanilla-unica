import { describe, expect, it } from 'vitest'

import { readNotaPrice } from './readNotaPrice'

describe('readNotaPrice', () => {
  it('reads the amount after the summary header, not an earlier one', () => {
    expect(
      readNotaPrice(
        '<p>Otro 9,99 €</p><th>Cantidad/Coste</th><td>3,58 &euro;</td>',
      ),
    ).toBe('3,58 €')
  })

  it('answers undefined without an amount', () => {
    expect(readNotaPrice('<p>Pago seguro</p>')).toBeUndefined()
  })
})
