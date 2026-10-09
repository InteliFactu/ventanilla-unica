import { unescapeHtml } from '../../../html/unescapeHtml'

/**
 * The values one `changeDireccion()` block writes:
 * `getElementById(modo+"<field>").value='..'` (or `="..."`, or
 * `=htmlDecode("..")`), and the street type it selects (`acronimo="CALLE"`).
 */
export const readAddressFields = (
  block: string,
): Readonly<Record<string, string>> => {
  const fields: Record<string, string> = {}
  for (const [, name = '', single, double] of block.matchAll(
    /getElementById\(modo\+"(\w+)"\)\.value=(?:htmlDecode\()?(?:'([^']*)'|"([^"]*)")/g,
  ))
    fields[name] = single ?? unescapeHtml(double ?? '')
  const streetType = /acronimo="([^"]*)"/.exec(block)?.[1]
  if (streetType !== undefined) fields['tipoVia'] = streetType
  return fields
}
