import type { FixedWidthSchema } from '../types/FixedWidthSchema'
import { isFixedWidthFieldText } from './isFixedWidthFieldText'
import { isPositiveInteger } from './isPositiveInteger'

/** Problems in a design itself: non-integer or out-of-range numbers, overlaps and duplicate names. */
export const validateFixedWidthSchema = (
  schema: FixedWidthSchema,
): readonly string[] => {
  if (!isPositiveInteger(schema.recordLength))
    return [
      `recordLength ${String(schema.recordLength)} is not a positive integer`,
    ]
  const problems: string[] = []
  const names = new Set<string>()
  let previousEnd = 0
  const sorted = [...schema.fields].sort((a, b) => a.start - b.start)
  for (const field of sorted) {
    if (!isPositiveInteger(field.start) || !isPositiveInteger(field.length)) {
      problems.push(
        `${field.name}: start ${String(field.start)} and length ${String(field.length)} must be positive integers`,
      )
      continue
    }
    const end = field.start + field.length - 1
    if (end > schema.recordLength)
      problems.push(
        `${field.name}: positions ${String(field.start)}-${String(end)} are outside the record`,
      )
    if (field.start <= previousEnd)
      problems.push(`${field.name}: overlaps the previous field`)
    if (names.has(field.name)) problems.push(`${field.name}: duplicate name`)
    if (
      field.literal !== undefined &&
      !isFixedWidthFieldText(field, field.literal)
    )
      problems.push(`${field.name}: literal does not match the field format`)
    names.add(field.name)
    previousEnd = Math.max(previousEnd, end)
  }
  return problems
}
