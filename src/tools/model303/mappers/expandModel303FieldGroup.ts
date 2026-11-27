import type { Model303Field } from '../types/Model303Field'
import type { Model303FieldGroup } from '../types/Model303FieldGroup'

/** Recover individual positions from a workbook field group. */
export const expandModel303FieldGroup = ([
  start,
  widths,
  kind,
  allowed,
]: Model303FieldGroup): readonly Model303Field[] => {
  if (typeof widths === 'number') return [[start, widths, kind, allowed]]
  const fields: Model303Field[] = []
  let position = start
  for (const width of widths) {
    fields.push([position, width, kind, allowed])
    position += width
  }
  return fields
}
