import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/** Resolve a territorial code from the live dependent dropdown; never invent labels or codes. */
export const readCarpetaOptionLabel = (
  html: string,
  field: string,
  code: string,
): string => {
  const select = [...html.matchAll(/<select\b[\s\S]*?<\/select>/gi)]
    .map(([tag]) => tag)
    .find(
      (tag) =>
        readAttribute(tag.split('>')[0] ?? '', 'id') ===
        `formulario:${field}_ids`,
    )
  const option = [
    ...(select ?? '').matchAll(/(<option\b[^>]*>)([^<]*)<\/option>/gi),
  ].find((match) => readAttribute(match[1] ?? '', 'value') === code)
  if (!option || code === '')
    throw new Error(`Junta: ${field} code is not offered by the live form`)
  return unescapeHtml(option[2] ?? '')
}
