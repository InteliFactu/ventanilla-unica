import { describe, expect, it } from 'vitest'

import { buildModel190File } from '../model190/builders/buildModel190File'
import { declarant } from '../model190/fixtures/declarant'
import { perceptorCsv } from '../model190/fixtures/perceptorCsv'
import { parsePerceptorRows } from '../model190/parsers/parsePerceptorRows'
import { validateBoeFile } from './validators/validateBoeFile'

const file = buildModel190File(declarant, parsePerceptorRows(perceptorCsv))
const replaceAt = (
  record: string,
  offset: number,
  replacement: string,
): string =>
  record.slice(0, offset) +
  replacement +
  record.slice(offset + replacement.length)

describe('validateBoeFile', () => {
  it('accepts the existing modelo 190 output with or without record separators', () => {
    const lines = file.match(/.{500}/g)?.join('\r\n') ?? ''
    for (const input of [file, `${lines}\r\n`, `${file}\n`]) {
      expect(validateBoeFile(input)).toEqual({
        modelo: '190',
        ejercicio: '2025',
        registros: 4,
        valid: true,
        validation: 'layout',
        problems: [],
      })
    }
  })

  it('refuses record separators embedded inside records', () => {
    const embedded = `${file.slice(0, 10)}\r\n${file.slice(10)}`
    expect(validateBoeFile(embedded)).toMatchObject({
      valid: false,
      problems: [expect.stringContaining('record boundary')],
    })
  })

  it('reports a bad count, illegal amount character and bad perceptor NIF', () => {
    const altered =
      file.slice(0, 143) +
      '4' +
      file.slice(144, 525) +
      'A' +
      file.slice(526, 581) +
      'K' +
      file.slice(582)
    const result = validateBoeFile(altered)
    expect(result.valid).toBe(false)
    expect(result.problems).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/record 1.*registros/),
        expect.stringMatching(/record 2.*percepcion.*82-94/),
        expect.stringMatching(/record 2.*nif.*18-26/),
      ]),
    )
  })

  it.each([
    [145, '000000000000001', 'percepciones'],
    [160, '000000000000001', 'retenciones'],
    [120, 'C ', 'anterior'],
    [120, 'CS', 'complementaria'],
    [122, '1902025000002', 'anterior'],
    [17, ' '.repeat(40), 'nombre'],
    [175, '!'.repeat(50), 'correo'],
    [575, '00', 'provincia'],
    [575, '99', 'provincia'],
    [578, '99', 'subclave'],
  ])(
    'rejects a modelo 190 violation at byte offset %i',
    (offset, replacement, name) => {
      const report = validateBoeFile(replaceAt(file, offset, replacement))
      expect(report.valid).toBe(false)
      expect(report.problems.join('\n')).toContain(name)
    },
  )

  it.each(['53', '98'])('accepts modelo 190 province %s', (province) => {
    expect(validateBoeFile(replaceAt(file, 575, province)).valid).toBe(true)
  })

  it('reconciles signed cash, in-kind and incapacity perceptions separately from withholding', () => {
    const fields = [
      [144, 'N000000000113046000000000002571'],
      [580, 'N'],
      [607, ' 00000000003000000000000012'],
      [754, 'N00000000000750000000000034'],
      [781, ' 00000000000250000000000056'],
    ] as const
    const amended = fields.reduce(
      (record, [offset, value]) => replaceAt(record, offset, value),
      file,
    )
    expect(validateBoeFile(amended)).toMatchObject({
      valid: true,
      problems: [],
    })
  })
})
