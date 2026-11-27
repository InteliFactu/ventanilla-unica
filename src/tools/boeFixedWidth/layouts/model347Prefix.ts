import type { FixedWidthField } from '../types/FixedWidthField'

/** Identity fields common to all three modelo 347 record layouts. */
export const model347Prefix = (
  recordType: '1' | '2',
): readonly FixedWidthField[] => [
  { name: 'tipo', start: 1, length: 1, kind: 'N', literal: recordType },
  { name: 'modelo', start: 2, length: 3, kind: 'N', literal: '347' },
  { name: 'ejercicio', start: 5, length: 4, kind: 'N' },
  { name: 'nifDeclarante', start: 9, length: 9, kind: 'A' },
]
