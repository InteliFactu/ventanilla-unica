import type { FixedWidthSchema } from '../types/FixedWidthSchema'
import { describeFixedWidthFieldProblem } from '../validators/describeFixedWidthFieldProblem'
import { isFixedWidthFieldText } from '../validators/isFixedWidthFieldText'
import { validateFixedWidthSchema } from '../validators/validateFixedWidthSchema'
import { buildFixedWidthField } from './buildFixedWidthField'

/**
 * Writes one record from named values: alphanumerics are upper-cased without
 * accents, left aligned and blank padded; numerics are right aligned and zero
 * padded; `X` fields keep punctuation and case. A missing value is blank or
 * zero padded. A value that does not fit its field is rejected.
 */
export const buildFixedWidthRecord = (
  schema: FixedWidthSchema,
  values: Readonly<Record<string, string | number>>,
): string => {
  const designProblems = validateFixedWidthSchema(schema)
  if (designProblems.length > 0) throw new Error(designProblems.join('; '))
  const fields = [...schema.fields].sort(
    (left, right) => left.start - right.start,
  )
  const parts: string[] = []
  let end = 0
  for (const field of fields) {
    const value = Object.hasOwn(values, field.name)
      ? values[field.name]
      : undefined
    const text = buildFixedWidthField(field, value)
    if (!isFixedWidthFieldText(field, text))
      throw new Error(describeFixedWidthFieldProblem(field))
    parts.push(' '.repeat(field.start - 1 - end), text)
    end = field.start - 1 + field.length
  }
  return parts.join('').padEnd(schema.recordLength, ' ')
}
