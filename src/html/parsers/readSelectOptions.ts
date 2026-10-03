import { readAttribute } from '../readAttribute'
import type { SelectOption } from '../types/SelectOption'
import { unescapeHtml } from '../unescapeHtml'

/** The options of the `<select name="...">` on a page, in document order; empty when there is none. */
export const readSelectOptions = (
  html: string,
  name: string,
): readonly SelectOption[] => {
  const select = [
    ...html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi),
  ].find(([, tag = '']) => readAttribute(`<select ${tag}>`, 'name') === name)
  const inner = select?.[2] ?? ''
  return [...inner.matchAll(/<option\b([^>]*)>([^<]*)/gi)].map(
    ([, tag = '', label = '']) => ({
      value: unescapeHtml(readAttribute(`<option ${tag}>`, 'value') ?? ''),
      label: unescapeHtml(label).trim(),
    }),
  )
}
