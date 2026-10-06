import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/**
 * The `javax.faces.ViewState` a JSF page or A4J fragment carries. The sede
 * keeps the view on the client, so the state after a scroller click (which
 * page the grid shows) only exists in the fragment that answered it.
 */
export const readViewState = (html: string): string | undefined => {
  const tag = [...html.matchAll(/<input\b[^>]*>/gi)]
    .map(([input]) => input)
    .find((input) => readAttribute(input, 'name') === 'javax.faces.ViewState')
  const value = tag ? readAttribute(tag, 'value') : undefined
  return value === undefined ? undefined : unescapeHtml(value)
}
