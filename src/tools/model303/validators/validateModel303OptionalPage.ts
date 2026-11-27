import { expandModel303FieldGroup } from '../mappers/expandModel303FieldGroup'
import type { Model303Page } from '../types/Model303Page'

/** Omit optional annual and proration pages that contain only default fills. */
export const validateModel303OptionalPage = ({
  layout,
  text,
}: Model303Page): readonly string[] => {
  const lastDataPosition =
    layout.tag === '04000' ? 386 : layout.length - 12 - 672
  const fields = layout.fields.flatMap(expandModel303FieldGroup)
  const substantive = fields.some(([start, width, kind]) => {
    if (start < 13 || start > lastDataPosition) return false
    const value = text.slice(start - 1, start - 1 + width)
    return kind === 'N' || kind === 'Num'
      ? /[1-9]/.test(value)
      : value.trim() !== ''
  })
  return substantive
    ? []
    : ['omit this page when it has no substantive content']
}
