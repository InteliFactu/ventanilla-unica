import { describe, expect, it } from 'vitest'

import { parseOargtLiquidations } from './parseOargtLiquidations'

const page = (own: string, represented: string): string =>
  `<div id="LISTALIQ_TODAS" class="LISTALIQ widget "><div class="Informativo info">${own}</div></div>
   <div id="LISTALIQ_REPRESENTANTE" class="LISTALIQ widget "><div class="Informativo info">${represented}</div></div>`

describe('parseOargtLiquidations', () => {
  it('reads two empty lists', () => {
    expect(
      parseOargtLiquidations(
        page(
          'No tiene ninguna liquidación.',
          'No tiene liquidaciones como representante.',
        ),
      ),
    ).toEqual({
      contactConfirmationPending: false,
      hasLiquidations: false,
      hasLiquidationsAsRepresentative: false,
      notes: [],
    })
  })

  it('refuses a list with rows and a page without the list', () => {
    expect(() =>
      parseOargtLiquidations(
        page('<table></table>', 'No tiene liquidaciones como representante.'),
      ),
    ).toThrow('not been captured')
    expect(() => parseOargtLiquidations('<html></html>')).toThrow(
      'no "Mis liquidaciones"',
    )
  })
})
