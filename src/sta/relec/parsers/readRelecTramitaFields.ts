import { unescapeHtml } from '../../../html/unescapeHtml'
import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'

/** Read the portal's input defaults and unambiguous dynamic textarea defaults. */
export const readRelecTramitaFields = (
  controls: ReadonlyMap<string, readonly RelecCatalogueTag[]>,
): Readonly<Record<string, string>> =>
  Object.fromEntries(
    [...controls].flatMap(([name, tags]) => {
      if (name.startsWith('DinTit') && tags.length !== 1) return []
      const input = tags.findLast((tag) => tag.name === 'input')
      if (input) return [[name, input.attributes.get('value') ?? '']]
      const textarea = tags[0]
      return name.startsWith('DinVar') &&
        tags.length === 1 &&
        textarea?.name === 'textarea'
        ? [[name, unescapeHtml(textarea.text.replace(/^(?:\r\n?|\n)/, ''))]]
        : []
    }),
  )
