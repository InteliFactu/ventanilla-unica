import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/** Enabled text inputs with their value, and checked radios and checkboxes. */
export const readYouthGuaranteeInputDefaults = (
  block: string,
): Record<string, string> => {
  const defaults: Record<string, string> = {}
  for (const [tag] of block.matchAll(/<input\b[^>]*>/gi)) {
    const name = readAttribute(tag, 'name')
    const type = (readAttribute(tag, 'type') ?? 'text').toLowerCase()
    const sent =
      type === 'text' ||
      ((type === 'radio' || type === 'checkbox') && /\bchecked\b/i.test(tag))
    if (name && sent && !/\bdisabled\b/i.test(tag))
      defaults[name] = unescapeHtml(readAttribute(tag, 'value') ?? '')
  }
  return defaults
}
