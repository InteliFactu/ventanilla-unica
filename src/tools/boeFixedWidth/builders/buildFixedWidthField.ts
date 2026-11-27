import { plainUpperText } from '../mappers/plainUpperText'
import type { FixedWidthField } from '../types/FixedWidthField'

/** Encode one named value without truncating it or rounding a number. */
export const buildFixedWidthField = (
  field: FixedWidthField,
  value: number | string | undefined,
): string => {
  if (field.literal !== undefined && value === undefined) return field.literal
  if (typeof value === 'number' && !Number.isSafeInteger(value))
    throw new Error(`${field.name}: expected a safe integer or a string`)
  const raw = String(value ?? '')
  const text = field.kind === 'A' ? plainUpperText(raw) : raw
  if (text.length > field.length)
    throw new Error(
      `${field.name}: value does not fit ${String(field.length)} characters`,
    )
  return field.kind === 'N'
    ? text.padStart(field.length, '0')
    : text.padEnd(field.length, ' ')
}
