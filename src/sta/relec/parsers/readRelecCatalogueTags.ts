import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'
import { readRelecTagAttributes } from './readRelecTagAttributes'

/** Scan active form markup, ignoring comments, templates and raw-text subtrees. */
export const readRelecCatalogueTags = (
  html: string,
): readonly RelecCatalogueTag[] => {
  let templates = 0
  return [
    ...html.matchAll(
      /<!--[\s\S]*?(?:-->|$)|<(textarea|script|style|title|xmp|iframe|noembed|noframes|noscript)(?=[\s/>])((?:"[^"]*"|'[^']*'|[^"'<>])*)>([\s\S]*?)(?:<\/\1\s*>|$)|<(\/?)([a-z][\w:-]*)(?=[\s/>])((?:"[^"]*"|'[^']*'|[^"'<>])*)>/gi,
    ),
  ]
    .flatMap(([, raw, rawAttributes, text, closing, tag, attributes]) => {
      const name = (raw ?? tag)?.toLowerCase()
      if (!name || (raw && name !== 'textarea')) return []
      return [
        {
          name,
          closing: Boolean(closing),
          attributes: readRelecTagAttributes(rawAttributes ?? attributes ?? ''),
          text: text ?? '',
        },
      ]
    })
    .filter(({ name, closing }) => {
      if (name !== 'template') return templates === 0
      templates = Math.max(0, templates + (closing ? -1 : 1))
      return false
    })
}
