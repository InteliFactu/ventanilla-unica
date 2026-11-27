import type { Model303Field } from '../types/Model303Field'
import { isModel303PrintableText } from './isModel303PrintableText'
import { model303FieldPatterns } from './model303FieldPatterns'

/** Whether a field has the exact width, character format and literal values. */
export const isModel303FieldText = (
  value: string,
  [, width, kind, allowed]: Model303Field,
): boolean =>
  value.length === width &&
  isModel303PrintableText(value) &&
  model303FieldPatterns[kind].test(value) &&
  (allowed === undefined || allowed.includes(value))
