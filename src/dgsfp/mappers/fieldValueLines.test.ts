import { describe, expect, it } from 'vitest'

import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'
import { fieldValueLines } from './fieldValueLines'

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

describe('fieldValueLines', () => {
  it('prints lists with their key and skips an unset list', () => {
    expect(
      fieldValueLines(
        field({ tipo: 'DatosControlLista', key: '10', value: 'Cáceres' }),
      ),
    ).toEqual(['(10) Cáceres'])
    expect(
      fieldValueLines(
        field({ tipo: 'DatosControlLista', key: '-1', value: 'x' }),
      ),
    ).toEqual([])
  })

  it('prints files, remarks, dates and multi-line text', () => {
    expect(
      fieldValueLines(
        field({
          tipo: 'DatosControlFichero',
          value: 'Nota',
          multiple: [{ key: 'h', value: 'a.pdf' }],
        }),
      ),
    ).toEqual(['Archivo: a.pdf', 'Hash: h', 'Observaciones: Nota'])
    expect(
      fieldValueLines(
        field({ tipo: 'DatosControlFecha', value: '2026-09-30T00:00:00.000Z' }),
      ),
    ).toEqual(['30 de septiembre de 2026'])
    expect(
      fieldValueLines(
        field({ tipo: 'DatosControlTextoMultilinea', value: 'a\nb' }),
      ),
    ).toEqual(['a', 'b'])
    expect(fieldValueLines(field({ key: '1', value: 'Uno' }))).toEqual([
      '(1) Uno',
    ])
    expect(
      fieldValueLines(field({ tipo: 'DatosControlSiNo', value: 'true' })),
    ).toEqual([])
  })
})
