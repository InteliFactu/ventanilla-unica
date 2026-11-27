import { readAgreementMarkupTags } from '../../../aeat/debts/parsers/readAgreementMarkupTags'
import { readAttribute } from '../../../html/readAttribute'

/** Read the contents of one uniquely identified and closed liquidation widget. */
export const readOargtLiquidationWidget = (
  html: string,
  id: string,
): string | undefined => {
  const widgets = [...readAgreementMarkupTags(html)].filter(
    ([tag, closing, name]) =>
      !closing &&
      name?.toLowerCase() === 'div' &&
      readAttribute(tag, 'id') === id,
  )
  const [widget] = widgets
  if (!widget || widgets.length !== 1) return undefined
  const start = widget.index + widget[0].length
  const rest = html.slice(start)
  let depth = 1
  for (const match of readAgreementMarkupTags(rest)) {
    const [, closing, name] = match
    if (name?.toLowerCase() !== 'div') continue
    depth += closing ? -1 : 1
    if (depth === 0) return rest.slice(0, match.index)
  }
  return undefined
}
