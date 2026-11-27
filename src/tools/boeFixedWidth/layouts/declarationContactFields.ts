import type { FixedWidthField } from '../types/FixedWidthField'

/** Contact and declaration identifiers shared by the 190 and 347 types 1. */
export const declarationContactFields: readonly FixedWidthField[] = [
  { name: 'telefono', start: 59, length: 9, kind: 'N' },
  { name: 'contacto', start: 68, length: 40, kind: 'A' },
  { name: 'declaracion', start: 108, length: 13, kind: 'N' },
  {
    name: 'complementaria',
    start: 121,
    length: 1,
    kind: 'A',
    allowed: [' ', 'C'],
  },
  {
    name: 'sustitutiva',
    start: 122,
    length: 1,
    kind: 'A',
    allowed: [' ', 'S'],
  },
  { name: 'anterior', start: 123, length: 13, kind: 'N' },
]
