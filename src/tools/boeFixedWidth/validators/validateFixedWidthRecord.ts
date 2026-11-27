import type { FixedWidthSchema } from '../types/FixedWidthSchema'
import { describeFixedWidthFieldProblem } from './describeFixedWidthFieldProblem'
import { isFixedWidthFieldText } from './isFixedWidthFieldText'
import { validateFixedWidthSchema } from './validateFixedWidthSchema'

/** Problems in a record against its design: the design itself, length, field contents and non-blank uncovered positions. */
export const validateFixedWidthRecord = (
  schema: FixedWidthSchema,
  record: string,
): readonly string[] => {
  const designProblems = validateFixedWidthSchema(schema)
  if (designProblems.length > 0) return designProblems
  if (record.length !== schema.recordLength)
    return [
      `record is ${String(record.length)} characters, the design asks for ${String(schema.recordLength)}`,
    ]
  const problems: string[] = []
  const covered = Array.from({ length: schema.recordLength }, () => false)
  for (const field of schema.fields) {
    covered.fill(true, field.start - 1, field.start - 1 + field.length)
    const text = record.slice(field.start - 1, field.start - 1 + field.length)
    if (!isFixedWidthFieldText(field, text))
      problems.push(describeFixedWidthFieldProblem(field))
  }
  for (let index = 0; index < record.length; index += 1)
    if (!covered[index] && record[index] !== ' ')
      problems.push(
        `position ${String(index + 1)} is not covered and must be blank`,
      )
  return problems
}
