import { model303Layouts } from '../layouts/model303Layouts'
import { describeModel303Field } from '../mappers/describeModel303Field'
import { expandModel303FieldGroup } from '../mappers/expandModel303FieldGroup'
import type { Model303PageInput } from '../types/Model303PageInput'
import { isModel303FieldText } from '../validators/isModel303FieldText'
import { buildModel303FieldText } from './buildModel303FieldText'

/** Write one page from fields addressed by their exact workbook start positions. */
export const buildModel303Page = (input: Model303PageInput): string => {
  const { ejercicio, tag, values } = input
  const layout = model303Layouts[ejercicio]?.find((page) => page.tag === tag)
  if (layout === undefined)
    throw new Error('Modelo 303: unsupported exercise or page')
  const fields = layout.fields.flatMap(expandModel303FieldGroup)
  const starts = new Set(fields.map(([position]) => String(position)))
  for (const key of Object.keys(values))
    if (!starts.has(key))
      throw new Error(
        `Modelo 303: position ${key} is not a field start of page ${tag}`,
      )
  const content = fields
    .map((field) => {
      const [start] = field
      const text = buildModel303FieldText(
        field,
        Object.hasOwn(values, start) ? values[start] : undefined,
      )
      if (!isModel303FieldText(text, field))
        throw new Error(describeModel303Field(field))
      return text
    })
    .join('')
  return `<T303${tag}>${content}</T303${tag}>`
}
