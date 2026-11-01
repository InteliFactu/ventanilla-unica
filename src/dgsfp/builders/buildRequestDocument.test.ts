import { describe, expect, it } from 'vitest'

import { dgsfpPdfTextsFixture } from '../fixtures/dgsfpPdfTextsFixture'
import { dgsfpRequestValuesFixture } from '../fixtures/dgsfpRequestValuesFixture'
import { buildRequestDocument } from './buildRequestDocument'

describe('buildRequestDocument', () => {
  it('carries the sections, values, attachment hashes and HMAC the page prints', () => {
    const pdf = buildRequestDocument(
      dgsfpRequestValuesFixture,
      dgsfpPdfTextsFixture,
    ).toString('latin1')
    expect(pdf.startsWith('%PDF-1.4')).toBe(true)
    expect(pdf.trimEnd().endsWith('%%EOF')).toBe(true)
    for (const text of [
      'Reclamación ante el Servicio',
      'Datos del reclamante',
      'NIF:',
      '00000000T',
      'Archivo: escrito.pdf',
      'Hash: abc123',
      'HUELLA',
      'HMAC-0123456789',
      'Sede electrónica DGSFP',
      'Pie del documento',
      'Paseo de la Castellana 44',
      'Página 1 / 1',
    ])
      expect(pdf).toContain(`(${text})`)
  })

  it('leaves out hidden sections and fields excluded from the final report', () => {
    const pdf = buildRequestDocument(
      dgsfpRequestValuesFixture,
      dgsfpPdfTextsFixture,
    ).toString('latin1')
    expect(pdf).not.toContain('Sección invisible')
    expect(pdf).not.toContain('no debe salir')
    expect(pdf).not.toContain('oculto')
  })
})
