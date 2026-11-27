import type { FixedWidthField } from '../types/FixedWidthField'
import { fixedWidthPatterns } from './fixedWidthPatterns'

/** Check the bytes a single field permits after padding. */
export const isFixedWidthFieldText = (
  field: FixedWidthField,
  text: string,
): boolean =>
  text.length === field.length &&
  fixedWidthPatterns[field.kind].test(text) &&
  (field.allowed === undefined || field.allowed.includes(text)) &&
  (field.literal === undefined || text === field.literal)
