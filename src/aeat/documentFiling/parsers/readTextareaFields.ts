import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/** Every named `<textarea>` inside a form's markup, with its content. */
export const readTextareaFields = (inner: string): Record<string, string> =>
  Object.fromEntries(
    [...inner.matchAll(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/gi)].flatMap(
      ([, tag = '', value = '']): [string, string][] => {
        const name = readAttribute(`<textarea ${tag}>`, 'name')
        return name ? [[name, unescapeHtml(value)]] : []
      },
    ),
  )
