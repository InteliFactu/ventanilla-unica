import { describe, expect, it } from 'vitest'

import { validateBoeFile } from './validators/validateBoeFile'

// Synthetic records spelled position by position independently of the layouts.
const holder = '347202500000005M'
const operations = '000001234567890'
const rent = '000000000005667'
const header = [
  `1${holder}${'EMPRESA EJEMPLO'.padEnd(40)}T600000000${'CONTACTO'.padEnd(40)}`,
  '3472025000001  0000000000000',
  `000000001 ${operations}000000001N${rent}`,
]
  .join('')
  .padEnd(500)
const detail = [
  `2${holder}${' '.repeat(18)}${'OPERADOR EJEMPLO'.padEnd(40)}D99FR A`,
  ` ${operations}  ${'0'.repeat(15)} ${'0'.repeat(15)}0000`,
  ` ${operations}${` ${'0'.repeat(15)}`.repeat(7)}`,
  `${'FR12345678901'.padEnd(17)}    ${'0'.repeat(21)}`,
]
  .join('')
  .padEnd(500)
const property = [
  `2${holder}00000001R${' '.repeat(9)}${'ARRENDATARIO PRUEBA'.padEnd(40)}I`,
  `${' '.repeat(22)}N${rent}4`,
  `${' '.repeat(25)}${'CALLE'.padEnd(5)}${'VIA DE PRUEBA'.padEnd(50)}S/N`,
]
  .join('')
  .padEnd(326)
  .concat('1010000')
  .padEnd(500)

describe('modelo 347 file validation', () => {
  it('recognizes both declared and property detail records in the 2025 layout', () => {
    expect(validateBoeFile(`${header}${detail}${property}`)).toMatchObject({
      modelo: '347',
      ejercicio: '2025',
      registros: 3,
      validation: 'layout',
      valid: true,
      problems: [],
    })
  })

  it('reports unknown sheet type, a bad sign and subtype count mismatches', () => {
    const badDetail = `${detail.slice(0, 82)}X${detail.slice(83)}`
    const badProperty = `${property.slice(0, 75)}Z${property.slice(76)}`
    const report = validateBoeFile(`${header}${badDetail}${badProperty}`)
    expect(report.valid).toBe(false)
    expect(report.problems).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/record 2.*signoOperaciones.*83-83/),
        expect.stringMatching(/record 3.*tipoHoja.*76/),
        expect.stringMatching(/record 1.*inmuebles.*161-169/),
      ]),
    )
  })

  it.each([
    [107, '999', 'declaracion'],
    [578, '22', 'pais'],
    [583, '000000000000001', 'importeOperaciones'],
    [763, '12', 'nifComunitario'],
    [763, 'ZZ', 'nifComunitario'],
    [763, 'FR1'.padEnd(17), 'nifComunitario'],
    [799, '123456', 'convocatoriaBdns'],
    [1099, '000000000000001', 'importeArrendamientos'],
    [1326, 'ZZ', 'provincia'],
  ])(
    'rejects a modelo 347 violation at byte offset %i',
    (offset, replacement, name) => {
      const file = header + detail + property
      const report = validateBoeFile(
        file.slice(0, offset) +
          replacement +
          file.slice(offset + replacement.length),
      )
      expect(report.valid).toBe(false)
      expect(report.problems.join('\n')).toContain(name)
    },
  )
})
