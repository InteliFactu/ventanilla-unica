import { readAttribute } from '../../../html/readAttribute'
import { readYouthGuaranteeLabel } from './readYouthGuaranteeLabel'

export const readYouthGuaranteeControlLabel = (
  html: string,
  tag: string,
): string => {
  const name = readAttribute(tag, 'name') ?? ''
  const optionLabel = readYouthGuaranteeLabel(
    html,
    readAttribute(tag, 'id') ?? name,
  )
  const groupLabel =
    readAttribute(tag, 'type') === 'radio'
      ? readYouthGuaranteeLabel(html, name)
      : ''
  return groupLabel || optionLabel || readAttribute(tag, 'title') || name
}
