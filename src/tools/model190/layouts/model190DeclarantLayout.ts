import { declarationContactFields } from '../../boeFixedWidth/layouts/declarationContactFields'
import type { FixedWidthSchema } from '../../boeFixedWidth/types/FixedWidthSchema'

/** AEAT modelo 190, 2025 design, type 1. */
export const model190DeclarantLayout: FixedWidthSchema = {
  recordLength: 500,
  fields: [
    { name: 'tipo', start: 1, length: 1, kind: 'N', literal: '1' },
    { name: 'modelo', start: 2, length: 3, kind: 'N', literal: '190' },
    { name: 'ejercicio', start: 5, length: 4, kind: 'N' },
    { name: 'nif', start: 9, length: 9, kind: 'A' },
    { name: 'nombre', start: 18, length: 40, kind: 'A' },
    { name: 'soporte', start: 58, length: 1, kind: 'A', literal: 'T' },
    ...declarationContactFields,
    { name: 'registros', start: 136, length: 9, kind: 'N' },
    {
      name: 'signoPercepciones',
      start: 145,
      length: 1,
      kind: 'A',
      allowed: [' ', 'N'],
    },
    { name: 'percepciones', start: 146, length: 15, kind: 'N' },
    { name: 'retenciones', start: 161, length: 15, kind: 'N' },
    { name: 'correo', start: 176, length: 50, kind: 'X' },
    { name: 'sello', start: 488, length: 13, kind: 'A' },
  ],
}
