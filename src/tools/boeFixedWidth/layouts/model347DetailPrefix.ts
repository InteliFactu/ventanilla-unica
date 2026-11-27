import type { FixedWidthField } from '../types/FixedWidthField'
import { model347Prefix } from './model347Prefix'

/** The first 76 positions shared by declared and property detail records. */
export const model347DetailPrefix = (
  sheetType: 'D' | 'I',
): readonly FixedWidthField[] => [
  ...model347Prefix('2'),
  { name: 'nif', start: 18, length: 9, kind: 'A' },
  { name: 'nifRepresentante', start: 27, length: 9, kind: 'A' },
  { name: 'nombre', start: 36, length: 40, kind: 'A' },
  { name: 'tipoHoja', start: 76, length: 1, kind: 'A', literal: sheetType },
]
