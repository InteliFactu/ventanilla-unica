import { describeModel303Field } from '../mappers/describeModel303Field'
import type { Model303Field } from '../types/Model303Field'
import { isModel303FieldText } from './isModel303FieldText'

/** Report field positions without disclosing their values. */
export const validateModel303Field = (
  text: string,
  field: Model303Field,
): readonly string[] => {
  const [start, width] = field
  const end = start + width - 1
  const value = text.slice(start - 1, end)
  return isModel303FieldText(value, field) ? [] : [describeModel303Field(field)]
}
