import { readAttribute } from '../../html/readAttribute'
import { unescapeHtml } from '../../html/unescapeHtml'

/**
 * The decoded text of the first `<span>` whose id ends with `idSuffix`, or
 * undefined. PLACSP is a WebSphere/JSF portal: every id carries a portlet
 * prefix (`viewns_Z7_..._:form1:`) that changes between portlets, while the
 * component name after it (`text_Expediente`, `message248`) is stable.
 */
export const readSpanText = (
  html: string,
  idSuffix: string,
): string | undefined => {
  for (const [, tag = '', text = ''] of html.matchAll(
    /<span\b([^>]*)>([^<]*)/gi,
  ))
    if (readAttribute(`<span ${tag}>`, 'id')?.endsWith(idSuffix))
      return unescapeHtml(text).trim()
  return undefined
}
