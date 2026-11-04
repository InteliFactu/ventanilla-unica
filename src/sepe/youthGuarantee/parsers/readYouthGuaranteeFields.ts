import type { YouthGuaranteeField } from '../types/YouthGuaranteeField'
import { readYouthGuaranteeControl } from './readYouthGuaranteeControl'
import { readYouthGuaranteeFormHtml } from './readYouthGuaranteeFormHtml'

export const readYouthGuaranteeFields = (
  html: string,
): readonly YouthGuaranteeField[] => {
  const clean = readYouthGuaranteeFormHtml(html)
  const fields = new Map<string, YouthGuaranteeField>()
  for (const [tag] of clean.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)) {
    const field = readYouthGuaranteeControl(clean, tag)
    if (!field) continue
    const previous = fields.get(field.name)
    fields.set(
      field.name,
      previous
        ? { ...previous, options: [...previous.options, ...field.options] }
        : field,
    )
  }
  return [...fields.values()]
}
