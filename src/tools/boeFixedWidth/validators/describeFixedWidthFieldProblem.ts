import type { FixedWidthField } from '../types/FixedWidthField'

/** Report the affected field and positions without printing its contents. */
export const describeFixedWidthFieldProblem = (
  field: FixedWidthField,
): string =>
  `${field.name} (${String(field.start)}-${String(field.start + field.length - 1)}): value is not valid ${field.kind === 'N' ? 'digits for the field' : 'text for the field'}`
