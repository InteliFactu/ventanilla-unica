import type { FixedWidthSchema } from '../types/FixedWidthSchema'
import { declarationContactFields } from './declarationContactFields'
import { model347Prefix } from './model347Prefix'

/** AEAT modelo 347, 2025 design, type 1. */
export const model347DeclarantLayout: FixedWidthSchema = {
  recordLength: 500,
  fields: [
    ...model347Prefix('1'),
    { name: 'nombre', start: 18, length: 40, kind: 'A' },
    { name: 'soporte', start: 58, length: 1, kind: 'A', allowed: ['C', 'T'] },
    ...declarationContactFields,
    { name: 'declarados', start: 136, length: 9, kind: 'N' },
    {
      name: 'signoOperaciones',
      start: 145,
      length: 1,
      kind: 'A',
      allowed: [' ', 'N'],
    },
    { name: 'importeOperaciones', start: 146, length: 15, kind: 'N' },
    { name: 'inmuebles', start: 161, length: 9, kind: 'N' },
    {
      name: 'signoArrendamientos',
      start: 170,
      length: 1,
      kind: 'A',
      allowed: [' ', 'N'],
    },
    { name: 'importeArrendamientos', start: 171, length: 15, kind: 'N' },
    { name: 'nifRepresentante', start: 391, length: 9, kind: 'A' },
    { name: 'sello', start: 488, length: 13, kind: 'A' },
  ],
}
