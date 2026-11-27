import { describe, expect, it } from 'vitest'

import { validateBoeFile } from '../boeFixedWidth/validators/validateBoeFile'
import { buildModel303File } from './builders/buildModel303File'
import { buildModel303Page } from './builders/buildModel303Page'
import { validateModel303File } from './validators/validateModel303File'

const identification = (
  year: '2025' | '2026',
  period = '3T',
  regime = '3',
): string => {
  const amountsEnd = year === '2025' ? 1034 : 1035
  const lastPeriod = period === '12' || period === '4T' ? '212' : '200'
  const start = `<T30301000> I00000005M${'PEÑA EJEMPLO'.padEnd(80)}${year}${period}22${regime}222222${' '.repeat(9)}${lastPeriod}`
  const rate = year === '2025' ? 1013 : 523
  const data = `${start.padEnd(rate - 1, '0')}00050`.padEnd(amountsEnd, '0')
  return `${data.padEnd(1569)}</T30301000>`
}

const result = (year: '2025' | '2026'): string => {
  const start = '<T30303000>'.padEnd(year === '2025' ? 390 : 424, '0')
  const body =
    year === '2025'
      ? `${start}${' '.repeat(16)}${'0'.repeat(34)}`
      : `${start}${' '.repeat(16)}${'0'.repeat(17)}`
  return `${body.padEnd(1005)}</T30303000>`
}

const declaration = (year: '2025' | '2026', regime = '3'): string =>
  `<T3030${year}3T0000><AUX>${' '.repeat(300)}</AUX>${identification(year, '3T', regime)}${result(year)}</T3030${year}3T0000>`

describe('modelo 303 layout', () => {
  it('requires a complementary marker and rejects non-complementary fields on repeat pages', () => {
    const basic = buildModel303Page({
      ejercicio: '2026',
      tag: '02000',
      values: { 13: '1' },
    })
    const complementary = buildModel303Page({
      ejercicio: '2026',
      tag: '02000',
      values: { 12: 'C', 13: '2' },
    })
    expect(
      validateModel303File(
        declaration('2026', '2').replace(
          result('2026'),
          `${basic}${complementary}${result('2026')}`,
        ),
      ).valid,
    ).toBe(true)
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '3T',
        pages: [
          identification('2026', '3T', '2'),
          basic,
          basic,
          result('2026'),
        ],
      }),
    ).toThrow(/complementary-page marker/)
    const unexpectedData = buildModel303Page({
      ejercicio: '2026',
      tag: '02000',
      values: { 12: 'C', 901: '47' },
    })
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '3T',
        pages: [
          identification('2026', '3T', '2'),
          basic,
          unexpectedData,
          result('2026'),
        ],
      }),
    ).toThrow(/901-1104.*complementary/)
  })

  it.each(['2025', '2026'] as const)(
    'accepts all optional page types at their published %s lengths',
    (year) => {
      const simplified = buildModel303Page({
        ejercicio: year,
        tag: '02000',
        values: { 13: '1' },
      })
      const annual = buildModel303Page({
        ejercicio: year,
        tag: '04000',
        values: { 13: 'A01' },
      })
      const prorata = buildModel303Page({
        ejercicio: year,
        tag: '05000',
        values: { 13: '0111'.slice(0, year === '2025' ? 3 : 4) },
      })
      const bank = buildModel303Page({
        ejercicio: year,
        tag: 'DID00',
        values: {},
      })
      expect([
        simplified.length,
        annual.length,
        prorata.length,
        bank.length,
      ]).toEqual([1900, 998, year === '2025' ? 1523 : 1528, 823])
      const file = buildModel303File({
        ejercicio: year,
        periodo: '4T',
        pages: [
          identification(year, '4T', '2'),
          simplified,
          result(year),
          annual,
          prorata,
          bank,
        ],
      })
      expect(validateModel303File(file)).toMatchObject({
        valid: true,
        registros: 6,
      })
    },
  )

  it.each(['2025', '2026'] as const)(
    'checks and writes the exact %s record envelope',
    (year) => {
      const file = declaration(year)
      expect(validateBoeFile(file)).toEqual({
        modelo: '303',
        ejercicio: year,
        periodo: '3T',
        registros: 2,
        validation: 'layout',
        valid: true,
        problems: [],
      })
      expect(
        buildModel303File({
          ejercicio: year,
          periodo: '3T',
          pages: [identification(year), result(year)],
        }),
      ).toBe(file)
    },
  )

  it('rejects a mismatched end tag, truncated page or unsupported year', () => {
    const input = declaration('2026')
    expect(() =>
      validateModel303File(
        input.replace('</T303020263T0000>', '</T303020264T0000>'),
      ),
    ).toThrow(/matching.*tag/)
    expect(() =>
      validateModel303File(input.replace('</T30303000>', '</T3030300>')),
    ).toThrow(/page 03000/)
    expect(() =>
      validateModel303File(input.replaceAll('2026', '2027')),
    ).toThrow(/unsupported.*2027/)
  })

  it('reports the exact signed field and identification period that fail', () => {
    const page = result('2026')
    const signedData = `${page.slice(339, 340)}N000000000000000`
    const valid = `${page.slice(0, 339)}N${'0'.repeat(16)}${page.slice(356)}`
    const invalid = `${page.slice(0, 339)}${signedData}${page.slice(356)}`
    expect(
      validateModel303File(declaration('2026').replace(page, valid)).valid,
    ).toBe(true)
    const output = validateModel303File(
      declaration('2026')
        .replace(page, invalid)
        .replace(identification('2026'), identification('2026', '4T')),
    )
    expect(output.valid).toBe(false)
    expect(output.problems).toEqual(
      expect.arrayContaining([
        expect.stringContaining('340-356'),
        expect.stringContaining('period'),
      ]),
    )
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '3T',
        pages: [identification('2026'), invalid],
      }),
    ).toThrow(/340-356/)
  })
})
