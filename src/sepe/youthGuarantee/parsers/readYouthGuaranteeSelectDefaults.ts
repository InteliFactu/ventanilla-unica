import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/** Enabled selects with their selected option, or the first one. */
export const readYouthGuaranteeSelectDefaults = (
  block: string,
): Record<string, string> => {
  const defaults: Record<string, string> = {}
  for (const [, tag = '', inner = ''] of block.matchAll(
    /<select\b([^>]*)>([\s\S]*?)<\/select>/gi,
  )) {
    const name = readAttribute(`<select ${tag}>`, 'name')
    const options = [...inner.matchAll(/<option\b([^>]*)>/gi)].map(
      ([, option = '']) => option,
    )
    const chosen =
      options.find((option) => /\bselected\b/i.test(option)) ?? options[0]
    if (name && chosen !== undefined && !/\bdisabled\b/i.test(tag))
      defaults[name] = unescapeHtml(
        readAttribute(`<option ${chosen}>`, 'value') ?? '',
      )
  }
  return defaults
}
