import type { Model303Field } from '../types/Model303Field'

/** Pad a numeric or textual field using the workbook's sign and fill rules. */
export const buildModel303FieldText = (
  [, width, kind, allowed]: Model303Field,
  input: string | undefined,
): string => {
  const value = input ?? allowed?.[0] ?? ''
  if (kind === 'N' && /^[N-]\d+$/.test(value))
    return `N${value.slice(1).padStart(width - 1, '0')}`
  if (kind === 'N' || kind === 'Num') return value.padStart(width, '0')
  return value.padEnd(width, ' ')
}
