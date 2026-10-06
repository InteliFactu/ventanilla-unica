import { describe, expect, it } from 'vitest'

import { bulkFileText } from '../fixtures/bulkFileText'
import { tgviMenuPage } from '../fixtures/tgviMenuPage'
import { chunkRecords } from '../mappers/chunkRecords'
import { recordLengthOf } from '../mappers/recordLengthOf'
import { validateBulkFilingOptions } from '../validators/validateBulkFilingOptions'
import { parseActingNif } from './parseActingNif'
import { parseBulkFile } from './parseBulkFile'
import { parseSignatureDialog } from './parseSignatureDialog'
import { readTgviAnswer } from './readTgviAnswer'

describe('parseBulkFile', () => {
  it('splits the records with or without line breaks', () => {
    const lines = (bulkFileText.match(/.{500}/g) ?? []).join('\r\n')
    expect(parseBulkFile(lines)).toMatchObject({
      modelo: '190',
      ejercicio: '2025',
      nif: '00000005M',
      nombre: 'EMPRESA DE PRUEBA',
      recordLength: 500,
    })
    expect(parseBulkFile(bulkFileText).records).toHaveLength(3)
  })

  it('refuses a file that is not a return of one declarant', () => {
    expect(() => parseBulkFile(`2${bulkFileText.slice(1)}`)).toThrow(/type 1/)
    expect(() => parseBulkFile(bulkFileText.slice(0, 990))).toThrow(/type 1/)
    const stray = `${bulkFileText.slice(0, 509)}X${bulkFileText.slice(510)}`
    expect(() => parseBulkFile(stray)).toThrow(/record 2 is not a type 2/)
  })

  it('knows the 250-character models', () => {
    expect(recordLengthOf('347', '2025')).toBe(500)
    expect(recordLengthOf('182', '2025')).toBe(250)
    expect(recordLengthOf('192', '2023')).toBe(250)
    expect(recordLengthOf('192', '2024')).toBe(500)
  })

  it('sends at most 40,000 records per block', () => {
    expect(
      chunkRecords(Array.from({ length: 40_001 }, () => 'r')),
    ).toHaveLength(2)
  })
})

describe('TGVI answers', () => {
  it('reads the headers', () => {
    expect(
      readTgviAnswer({
        codigo: '0',
        idenvio: 'ID1',
        totalt2ok: '3',
        totalt2ko: '',
        avisos: 'N',
        sigbloque: ['2', '3'],
      }),
    ).toEqual({
      codigo: 0,
      mensaje: '',
      idEnvio: 'ID1',
      siguienteBloque: 2,
      correctos: 3,
      erroneos: undefined,
      avisos: false,
      csv: undefined,
    })
  })

  it('names who the session acts for', () => {
    expect(parseActingNif(tgviMenuPage('00000000T'))).toBe('00000000T')
    expect(parseActingNif(tgviMenuPage('00000000T', '00000005M'))).toBe(
      '00000005M',
    )
    expect(parseActingNif('<p>sin menu</p>')).toBeUndefined()
  })

  it('refuses a signature window without its call', () => {
    expect(() => parseSignatureDialog('<p>error</p>')).toThrow(
      /nothing is filed/,
    )
  })

  it('validates the options', () => {
    expect(validateBulkFilingOptions({ fichero: 'f' })).toEqual({
      fichero: 'f',
      periodo: '0A',
    })
    expect(() => validateBulkFilingOptions({})).toThrow(/--fichero/)
    expect(() =>
      validateBulkFilingOptions({ fichero: 'f', periodo: '5T' }),
    ).toThrow(/--periodo/)
  })
})
