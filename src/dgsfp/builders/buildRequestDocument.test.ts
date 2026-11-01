import { describe, expect, it } from 'vitest'

import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'
import type { DgsfpFormValues } from '../types/DgsfpFormValues'
import { buildRequestDocument } from './buildRequestDocument'

const field = (patch: Partial<DgsfpFieldValue>): DgsfpFieldValue => ({
  nombre: 'n',
  etiqueta: 'e',
  tipo: 'DatosControlTexto',
  key: '',
  value: '',
  visible: true,
  deshabilitado: false,
  ocultarInformeFinal: false,
  ...patch,
})

const values: DgsfpFormValues = {
  tituloFormulario: 'Reclamación ante el Servicio',
  secciones: [
    {
      nombre: 'Datos del reclamante',
      visible: true,
      lineasSeccion: [
        {
          campos: [
            field({ etiqueta: 'NIF', value: '00000000T' }),
            field({
              etiqueta: 'Interno',
              value: 'oculto',
              ocultarInformeFinal: true,
            }),
            null,
          ],
        },
        {
          campos: [
            field({
              etiqueta: 'Escrito',
              tipo: 'DatosControlFichero',
              multiple: [{ key: 'abc123', value: 'escrito.pdf' }],
            }),
          ],
        },
      ],
    },
    {
      nombre: 'Sección invisible',
      visible: false,
      lineasSeccion: [{ campos: [field({ value: 'no debe salir' })] }],
    },
  ],
}

const texts = {
  titleHeader: 'Sede electrónica DGSFP',
  footer: 'Pie del documento',
  footAddress: 'Paseo de la Castellana 44',
  hmac: 'HMAC-0123456789',
}

describe('buildRequestDocument', () => {
  it('carries the sections, values, attachment hashes and HMAC the page prints', () => {
    const pdf = buildRequestDocument(values, texts).toString('latin1')
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
    const pdf = buildRequestDocument(values, texts).toString('latin1')
    expect(pdf).not.toContain('Sección invisible')
    expect(pdf).not.toContain('no debe salir')
    expect(pdf).not.toContain('oculto')
  })
})
