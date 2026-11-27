import { describe, expect, it } from 'vitest'

import { parseOargtLiquidations } from './parseOargtLiquidations'

const page = (own: string, represented: string): string =>
  `<div id="LISTALIQ_TODAS" class="LISTALIQ widget "><div class="Informativo info">${own}</div></div>
   <div id="LISTALIQ_REPRESENTANTE" class="LISTALIQ widget "><div class="Informativo info">${represented}</div></div>`

const emptyOwn = 'No tiene ninguna liquidación.'
const emptyRepresented = 'No tiene liquidaciones como representante.'

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

  it.each([
    [
      'the representative widget is missing',
      `<div id="LISTALIQ_TODAS"><div class="Informativo info">${emptyOwn}</div></div><footer>${emptyRepresented}</footer>`,
    ],
    [
      'an empty notice only appears in a template',
      page(`<template>${emptyOwn}</template>`, emptyRepresented),
    ],
    [
      'a list has both rows and an empty notice',
      page(
        `${emptyOwn}<table><tr><td>Example liquidation</td></tr></table>`,
        emptyRepresented,
      ),
    ],
    [
      'a widget ID is repeated',
      `${page(emptyOwn, emptyRepresented)}<div id="LISTALIQ_REPRESENTANTE"></div>`,
    ],
  ])('refuses an ambiguous empty result when %s', (_example, html) => {
    expect(() => parseOargtLiquidations(html)).toThrow()
  })
})
