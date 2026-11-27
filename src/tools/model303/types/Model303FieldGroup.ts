import type { Model303Field } from './Model303Field'

/** Consecutive fields of one format, retaining the workbook's individual widths. */
export type Model303FieldGroup = readonly [
  start: number,
  widths: number | readonly number[],
  kind: Model303Field[2],
  allowed?: readonly string[],
]
