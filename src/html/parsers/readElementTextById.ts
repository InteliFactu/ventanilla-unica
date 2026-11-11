import { htmlToText } from '../htmlToText'
import { readAttribute } from '../readAttribute'

/**
 * The text of the element whose `id` is `id`, up to the first closing tag of
 * the same name (so it suits leaf elements such as `<span>`); null when no
 * such element exists or its text is blank.
 */
export const readElementTextById = (
  html: string,
  id: string,
): string | null => {
  for (const match of html.matchAll(/<([a-z][\w-]*)\b[^>]*>/gi)) {
    if (readAttribute(match[0], 'id') !== id) continue
    const start = match.index + match[0].length
    const end = html.indexOf(`</${match[1] ?? ''}`, start)
    const text = htmlToText(html.slice(start, end === -1 ? undefined : end))
    return text === '' ? null : text
  }
  return null
}
