import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/** Selected values from enabled selects; dependent option sets are supplied by the live sede. */
export const readCarpetaSelectFields = (
  block: string,
): Record<string, string> => {
  const fields: Record<string, string> = {}
  for (const match of block.matchAll(
    /(<select\b[^>]*>)([\s\S]*?)<\/select>/gi,
  )) {
    const name = readAttribute(match[1] ?? '', 'name')
    const options = [...(match[2] ?? '').matchAll(/<option\b[^>]*>/gi)].map(
      ([tag]) => tag,
    )
    if (name && !readAttribute(match[1] ?? '', 'disabled'))
      fields[name] = unescapeHtml(
        readAttribute(
          options.find((tag) => tag.includes('selected=')) ?? options[0] ?? '',
          'value',
        ) ?? '',
      )
  }
  return fields
}
