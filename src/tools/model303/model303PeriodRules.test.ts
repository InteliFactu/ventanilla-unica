import { describe, expect, it } from 'vitest'

import { buildModel303File } from './builders/buildModel303File'
import { buildModel303Page } from './builders/buildModel303Page'
import type { Model303PageInput } from './types/Model303PageInput'
import { validateModel303File } from './validators/validateModel303File'

const pagesFor = (
  period: string,
  holderValues: Model303PageInput['values'] = {},
  resultValues: Model303PageInput['values'] = {},
): readonly string[] => [
  buildModel303Page({
    ejercicio: '2026',
    tag: '01000',
    values: {
      13: 'I',
      14: '00000005M',
      23: 'PEÑA EJEMPLO',
      103: '2026',
      107: period,
      109: '2',
      111: '3',
      115: '2',
      116: '2',
      ...holderValues,
    },
  }),
  buildModel303Page({ ejercicio: '2026', tag: '03000', values: resultValues }),
]

describe('model 303 period fields', () => {
  it.each([
    [115, '1'],
    [116, '1'],
    [128, '1'],
    [129, '2'],
    [130, '1'],
  ] as const)('rejects field %s outside its published period', (pos, value) => {
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '3T',
        pages: pagesFor('3T', { [pos]: value }),
      }),
    ).toThrow(`position ${String(pos)}`)
  })

  it('accepts final-period flags and February fuel advance data', () => {
    const final = buildModel303File({
      ejercicio: '2026',
      periodo: '4T',
      pages: pagesFor('4T', { 115: '1', 128: '1', 129: '2' }),
    })
    expect(validateModel303File(final).valid).toBe(true)
    const february = buildModel303File({
      ejercicio: '2026',
      periodo: '02',
      pages: pagesFor('02', { 130: '1' }, { 391: '200' }),
    })
    expect(validateModel303File(february).valid).toBe(true)
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '01',
        pages: pagesFor('01', {}, { 391: '200' }),
      }),
    ).toThrow(/112.*period/)
  })

  it('enforces the field [169] surcharge and its exclusively Foral exception', () => {
    expect(() =>
      buildModel303File({
        ejercicio: '2026',
        periodo: '3T',
        pages: pagesFor('3T', { 523: '00000' }),
      }),
    ).toThrow(/169.*00050/)
    expect(
      validateModel303File(
        buildModel303File({
          ejercicio: '2026',
          periodo: '3T',
          pages: pagesFor('3T', {
            109: '1',
            128: '2',
            129: '2',
            130: '2',
            523: '00000',
          }),
        }),
      ).valid,
    ).toBe(true)
  })
})
