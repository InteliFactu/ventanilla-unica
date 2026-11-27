import type { Model303Field } from '../types/Model303Field'

/** Describe a malformed field using its workbook range and format. */
export const describeModel303Field = ([
  start,
  width,
  kind,
]: Model303Field): string =>
  `positions ${String(start)}-${String(start + width - 1)}: invalid ${kind} field`
