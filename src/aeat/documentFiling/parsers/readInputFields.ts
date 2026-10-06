import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/**
 * Every named hidden or text `<input>` inside a form's markup. Buttons are
 * left out on purpose: the registry's "Firmar Enviar" is a `type='button'`
 * input, and `form.submit()` never sends it.
 */
export const readInputFields = (inner: string): Record<string, string> =>
  Object.fromEntries(
    [...inner.matchAll(/<input\b[^>]*>/gi)].flatMap(
      ([input]): [string, string][] => {
        const type = (readAttribute(input, 'type') ?? 'text').toLowerCase()
        const name = readAttribute(input, 'name')
        if (!name || (type !== 'hidden' && type !== 'text')) return []
        return [[name, unescapeHtml(readAttribute(input, 'value') ?? '')]]
      },
    ),
  )
