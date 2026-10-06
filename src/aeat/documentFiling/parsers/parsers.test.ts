import { describe, expect, it } from 'vitest'

import { filingFormPage } from '../fixtures/filingFormPage'
import { signatureScreenPage } from '../fixtures/signatureScreenPage'
import { uploadAnswer } from '../fixtures/uploadAnswer'
import { parseFilingForm } from './parseFilingForm'
import { parseFilingReceipt } from './parseFilingReceipt'
import { parseSignatureScreen } from './parseSignatureScreen'
import { parseUploadAnswer } from './parseUploadAnswer'
import { readFilingAlert } from './readFilingAlert'
import { readFormFields } from './readFormFields'

const url = 'https://www1.agenciatributaria.gob.es/wlpl/REGD-JDIT/FG'

describe('documentFiling parsers', () => {
  it('reads the procedure, the parties and the expediente of the step-1 form', () => {
    const form = parseFilingForm({ url, html: filingFormPage() })
    expect(form.tramite).toMatch(/^XX706 - Contestar requerimientos/)
    expect(form.procedimiento).toBe(
      'XX70 - Procedimiento sancionador de prueba',
    )
    expect(form.expediente).toBe('2026RSC00000000XX')
    expect(form.interesado).toEqual({
      nif: '00000000T',
      nombre: 'PEREZ PEREZ JUAN',
    })
    expect(form.representante?.nif).toBe('99999999R')
    expect(form.titular?.nombre).toBe('EJEMPLO ESPJ')
  })

  it('throws with the registry alert when the CSV opened no form', () => {
    const html = `<div id='idDivAlertas' class='x'>Ha eligido una identificación como Interesado, sin embargo, usted no es el interesado del documento introducido.  ( Ir a error ) </div>`
    expect(() => parseFilingForm({ url, html })).toThrow(
      'usted no es el interesado del documento introducido.)',
    )
    expect(readFilingAlert('<p>ok</p>')).toBeUndefined()
    expect(
      readFilingAlert(
        `<p>El documento no admite presentaciones <a href='#e'>( Ir a error )</a></p>`,
      ),
    ).toBe('El documento no admite presentaciones')
  })

  it('keeps hidden and text inputs and textareas, never buttons', () => {
    const fields = readFormFields(filingFormPage(), 'Form')
    expect(fields['fCSV']).toBe('ABCDEFGH12345678')
    expect(fields['fTexto']).toBe('')
    expect(fields).not.toHaveProperty('btnFirmar')
    expect(() => readFormFields('<p></p>', 'Form')).toThrow("no form 'Form'")
  })

  it('reads an upload answer and refuses a failed one', () => {
    expect(parseUploadAnswer(uploadAnswer('K1', 'a.pdf'))).toMatchObject({
      clave: 'K1',
      coleccion: 'EECAFICH',
      huellaAodit: 'BBBB',
      size: '000000010',
    })
    expect(() =>
      parseUploadAnswer('{"success":"false","error":"formato"}'),
    ).toThrow('refused (formato)')
    expect(() => parseUploadAnswer('<html>')).toThrow('no JSON')
  })

  it('lists every file and the signer on the signature screen', () => {
    const screen = parseSignatureScreen({
      url,
      html: signatureScreenPage(['a.pdf', 'b c.pdf', 'd.pdf']),
    })
    expect(screen.fileNames).toEqual(['a.pdf', 'b c.pdf', 'd.pdf'])
    expect(screen.signer).toEqual({
      nif: '99999999R',
      nombre: 'GOMEZ GOMEZ ANA',
    })
    expect(screen.fields).not.toHaveProperty('FirmayEnvia_1')
    expect(() => parseSignatureScreen({ url, html: '<p>x</p>' })).toThrow(
      'did not reach the signature step',
    )
  })

  it('reads the receipt leniently', () => {
    expect(
      parseFilingReceipt(
        '<p>Número de registro: RGE123456782026 el 06-10-2026 a las 12:30:01</p><a href="x?CSV=ABCDABCDABCDABCD">ver</a>',
      ),
    ).toEqual({
      csv: 'ABCDABCDABCDABCD',
      registro: 'RGE123456782026',
      fecha: '06-10-2026 a las 12:30:01',
    })
    expect(
      parseFilingReceipt(
        '<p>Código Seguro de Verificación: QWERQWERQWERQWER</p>',
      ).csv,
    ).toBe('QWERQWERQWERQWER')
    expect(parseFilingReceipt('<p>nada</p>')).toEqual({
      csv: undefined,
      registro: undefined,
      fecha: undefined,
    })
  })
})
