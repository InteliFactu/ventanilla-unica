import { unescapeHtml } from '../../html/unescapeHtml'

/** The URL of a JSF `partial-response` that answers with `<redirect url="...">`, if it does. */
export const readPartialRedirect = (xml: string): string | undefined => {
  const url = /<redirect\s+url="([^"]+)"/i.exec(xml)?.[1]
  return url === undefined ? undefined : unescapeHtml(url)
}
