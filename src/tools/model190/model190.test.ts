import { describe, expect, it } from 'vitest'

import { buildModel190File } from './builders/buildModel190File'
import { declarant } from './fixtures/declarant'
import { perceptorCsv } from './fixtures/perceptorCsv'
import { alphaField } from './mappers/alphaField'
import { centsToEuros } from './mappers/centsToEuros'
import { numberField } from './mappers/numberField'
import { plainUpperText } from './mappers/plainUpperText'
import { parseAmountCents } from './parsers/parseAmountCents'
import { parsePerceptorRow } from './parsers/parsePerceptorRow'
import { parsePerceptorRows } from './parsers/parsePerceptorRows'
import { splitCsvLine } from './parsers/splitCsvLine'

const row = (overrides: Record<string, string>): Record<string, string> => ({
  nif: '00000001R',
  nombre: 'PEREZ PEREZ JUAN',
  provincia: '10',
  clave: 'A',
  percepcion: '10',
  nacimiento: '1990',
  contrato: '1',
  ...overrides,
})

/** The 1-based, inclusive positions of the BOE design. */
const at = (record: string, from: number, to: number): string =>
  record.slice(from - 1, to)

describe('modelo 190 fields', () => {
  it('drops accents and punctuation but keeps Ñ and Ç', () => {
    expect(plainUpperText('Peña,  José  Çà')).toBe('PEÑA JOSE ÇA')
  })

  it('pads and refuses what does not fit', () => {
    expect(alphaField('AB', 4)).toBe('AB  ')
    expect(() => alphaField('ABCDE', 4)).toThrow(/does not fit/)
    expect(numberField(42, 5)).toBe('00042')
    expect(() => numberField('4a', 5)).toThrow(/5-digit/)
    expect(() => numberField(123456, 5)).toThrow(/5-digit/)
    expect(centsToEuros(492210)).toBe('4922.10')
  })

  it('reads amounts with a decimal point or a decimal comma', () => {
    expect(parseAmountCents('1396.58', 'x')).toBe(139658)
    expect(parseAmountCents('1.396,58', 'x')).toBe(139658)
    expect(parseAmountCents('1,6', 'x')).toBe(160)
    expect(parseAmountCents('', 'x')).toBe(0)
    expect(() => parseAmountCents('12.345', 'retencion')).toThrow(
      /retencion "12.345"/,
    )
  })

  it('splits quoted CSV fields', () => {
    expect(splitCsvLine('a,"b, c","d ""e"""')).toEqual(['a', 'b, c', 'd "e"'])
  })
})

describe('parsePerceptorRow', () => {
  it('zeroes the A-only data under clave L', () => {
    expect(
      parsePerceptorRow(row({ clave: 'L', subclave: '05', nacimiento: '' })),
    ).toMatchObject({ subclave: '05', nacimiento: '0000', contrato: '0' })
  })

  it.each([
    [{ clave: 'B' }, /only A and L/],
    [{ clave: 'L', subclave: '' }, /two-digit subclave/],
    [{ nacimiento: '' }, /nacimiento is missing/],
    [{ nacimiento: '90' }, /must be 4 digits/],
    [{ contrato: '5' }, /must be 1 to 4/],
    [{ situacion: '4' }, /must be 1, 2 or 3/],
    [{ nif: '00000001A' }, /not a valid NIF/],
  ])('refuses %o', (overrides, message) => {
    expect(() => parsePerceptorRow(row(overrides))).toThrow(message)
  })

  it('names the data row that failed', () => {
    expect(() => parsePerceptorRows(`clave\nX\n`)).toThrow(/^row 1: /)
  })
})

describe('buildModel190File', () => {
  const perceptors = parsePerceptorRows(perceptorCsv)
  const file = buildModel190File(declarant, perceptors)
  const [header = '', first = '', , third = ''] = file.match(/.{500}/g) ?? []

  it('writes one type 1 and one type 2 record per row, 500 characters each', () => {
    expect(file).toHaveLength(2000)
  })

  it('totals the type 1 record', () => {
    expect(at(header, 1, 17)).toBe('1190202500000005M')
    expect(at(header, 58, 67)).toBe('T600000000')
    expect(at(header, 108, 120)).toBe('1902025000001')
    expect(at(header, 136, 144)).toBe('000000003')
    expect(at(header, 145, 160)).toBe(' 000000000133616')
    expect(at(header, 161, 175)).toBe('000000000002469')
    expect(at(header, 176, 225).trim()).toBe('PRUEBA@EXAMPLE.ORG')
  })

  it('places the clave A data where the 2025 design puts it', () => {
    expect(at(first, 18, 26)).toBe('00000001R')
    expect(at(first, 36, 75).trim()).toBe('PEREZ PEÑA JOSE')
    expect(at(first, 76, 80)).toBe('10A00')
    expect(at(first, 82, 94)).toBe('0000000123456')
    expect(at(first, 95, 107)).toBe('0000000002469')
    expect(at(first, 153, 157)).toBe('19903')
    expect(at(first, 168, 168)).toBe('2')
    expect(at(first, 184, 196)).toBe('0000000007890')
    expect(at(first, 395, 500).trim()).toBe('')
  })

  it('writes clave L with its subclave and no personal data', () => {
    expect(at(third, 76, 80)).toBe('06L05')
    expect(at(third, 153, 157)).toBe('00000')
  })
})
