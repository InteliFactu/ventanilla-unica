import { describe, expect, it } from 'vitest'

import { buildModel303File } from './builders/buildModel303File'
import { buildModel303Page } from './builders/buildModel303Page'
import type { Model303PageInput } from './types/Model303PageInput'
import { validateModel303File } from './validators/validateModel303File'

const page = (
  ejercicio: Model303PageInput['ejercicio'],
  tag: Model303PageInput['tag'],
  values: Model303PageInput['values'] = {},
): string => buildModel303Page({ ejercicio, tag, values })

const holder = (
  year: Model303PageInput['ejercicio'],
  values: Model303PageInput['values'] = {},
  period = '3T',
): string =>
  page(year, '01000', {
    13: 'I',
    14: '00000005M',
    23: 'PEÑA EJEMPLO',
    103: year,
    107: period,
    109: '2',
    111: '3',
    115: '2',
    116: '2',
    ...values,
  })

describe('model 303 page rules', () => {
  it.each(['1', '2'])('requires page 2 when the regime is %s', (regime) => {
    const pages = [holder('2026', { 111: regime }), page('2026', '03000')]
    expect(() =>
      buildModel303File({ ejercicio: '2026', periodo: '3T', pages }),
    ).toThrow(/regime.*02000/)
    expect(
      validateModel303File(
        buildModel303File({
          ejercicio: '2026',
          periodo: '3T',
          pages: [...pages, page('2026', '02000')],
        }),
      ).valid,
    ).toBe(true)
  })

  it('refuses page 2 in general regime and empty optional annual or proration pages', () => {
    const pages = [holder('2026'), page('2026', '03000')]
    for (const tag of ['02000', '04000', '05000'] as const) {
      expect(() =>
        buildModel303File({
          ejercicio: '2026',
          periodo: '3T',
          pages: [...pages, page('2026', tag)],
        }),
      ).toThrow(tag)
    }
  })

  it.each([
    ['2025', 392, 406, 424],
    ['2026', 426, 440, 441],
  ] as const)(
    'requires bank details for box 111 in %s except when changing the debit instructions',
    (year, marker, debitChange, amount) => {
      const adjustment = { [marker]: 'X', [amount]: '1' }
      const pages = [holder(year), page(year, '03000', adjustment)]
      expect(() =>
        buildModel303File({ ejercicio: year, periodo: '3T', pages }),
      ).toThrow(/111.*DID00/)
      const bank = page(year, 'DID00', {
        23: 'ES0000000000000000000000',
        194: '1',
      })
      expect(
        validateModel303File(
          buildModel303File({
            ejercicio: year,
            periodo: '3T',
            pages: [...pages, bank],
          }),
        ).valid,
      ).toBe(true)
      expect(
        validateModel303File(
          buildModel303File({
            ejercicio: year,
            periodo: '3T',
            pages: [
              holder(year),
              page(year, '03000', { ...adjustment, [debitChange]: 'X' }),
            ],
          }),
        ).valid,
      ).toBe(true)
    },
  )

  it('rejects invalid SEPA markers, proration values and software NIFs', () => {
    expect(() => page('2026', 'DID00', { 194: '4' })).toThrow(/194/)
    expect(() => page('2026', '05000', { 51: 'S' })).toThrow(/51/)
    const pages = [holder('2026'), page('2026', '03000')]
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '3T',
        pages: [...pages, page('2026', '05000', { 51: 'E', 52: '10001' })],
      }),
    ).toThrow(/52.*100/)
    const prorata = page('2026', '05000', { 51: 'G', 52: '10000' })
    expect(
      validateModel303File(
        buildModel303File({
          ejercicio: '2026',
          periodo: '3T',
          pages: [...pages, prorata],
        }),
      ).valid,
    ).toBe(true)
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '3T',
        pages,
        softwareNif: 'AAAAAAAAA',
      }),
    ).toThrow(/software NIF/)
    expect(
      validateModel303File(
        buildModel303File({
          ejercicio: '2026',
          periodo: '3T',
          pages,
          softwareNif: '00000001R',
        }),
      ).valid,
    ).toBe(true)
  })
})
