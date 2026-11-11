import { readAttribute } from '../readAttribute'
import { unescapeHtml } from '../unescapeHtml'

/**
 * The trimmed `value` of the `<input>` whose `id` is `id`; null when no such
 * input exists or its value is blank. Read-only displays render values in
 * inputs that carry an id and no name, which `parseForms` does not collect.
 */
export const readInputValueById = (html: string, id: string): string | null => {
  for (const [tag] of html.matchAll(/<input\b[^>]*>/gi)) {
    if (readAttribute(tag, 'id') !== id) continue
    const value = unescapeHtml(readAttribute(tag, 'value') ?? '').trim()
    return value === '' ? null : value
  }
  return null
}
