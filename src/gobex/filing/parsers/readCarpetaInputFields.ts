import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/** The successful input controls, excluding buttons and unchecked choices. */
export const readCarpetaInputFields = (block: string): Record<string, string> =>
  Object.fromEntries(
    [...block.matchAll(/<input\b[^>]*>/gi)]
      .map(([tag]) => ({
        tag,
        name: readAttribute(tag, 'name'),
        type: readAttribute(tag, 'type') ?? '',
      }))
      .filter(
        ({ tag, name, type }) =>
          name &&
          !['button', 'submit', 'image', 'reset'].includes(type) &&
          (!['checkbox', 'radio'].includes(type) || tag.includes('checked=')),
      )
      .map(({ tag, name, type }) => [
        name ?? '',
        type === 'checkbox'
          ? 'on'
          : unescapeHtml(readAttribute(tag, 'value') ?? ''),
      ]),
  )
