import { htmlToText } from '../../html/htmlToText'
import { normalizeLabel } from '../../html/mappers/normalizeLabel'
import { readAttribute } from '../../html/readAttribute'

/** Read the paired label and value columns used by the SNE result. */
export const readSexpeDemandFields = (
  section: string,
): ReadonlyMap<string, string> => {
  const fields = new Map<string, string>()
  const pairs = section.matchAll(
    /(<div\b[^>]*>)\s*<b\b[^>]*>([^<>]*)<\/b>\s*<\/div>\s*(<div\b[^>]*>)(\s*<div\b[^>]*>[^<>]*<\/div>\s*|[^<>]*(?:<br\s*\/?>[^<>]*)*)<\/div>/gi,
  )
  for (const [
    ,
    labelTag = '',
    label = '',
    valueTag = '',
    value = '',
  ] of pairs) {
    if (
      readAttribute(labelTag, 'class') !== 'floatL' ||
      readAttribute(valueTag, 'class') !== 'floatL'
    )
      continue
    const key = normalizeLabel(htmlToText(label))
    if (fields.has(key))
      throw new Error('SEXPE: ambiguous administrative fields')
    fields.set(key, htmlToText(value))
  }
  return fields
}
