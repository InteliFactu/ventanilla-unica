import { readAttribute } from '../../../html/readAttribute'
import type { YouthGuaranteeField } from '../types/YouthGuaranteeField'
import { readYouthGuaranteeControlLabel } from './readYouthGuaranteeControlLabel'
import { readYouthGuaranteeControlOptions } from './readYouthGuaranteeControlOptions'

export const readYouthGuaranteeControl = (
  html: string,
  tag: string,
): YouthGuaranteeField | undefined => {
  const name = readAttribute(tag, 'name')
  const type =
    readAttribute(tag, 'type') ??
    (tag.startsWith('<select') ? 'select' : 'text')
  if (!name || ['hidden', 'submit', 'button', 'file'].includes(type))
    return undefined
  const label = readYouthGuaranteeControlLabel(html, tag)
  return {
    name,
    label,
    type,
    required: /\brequired\b/i.test(tag) || /\(\s*\*\s*\)/.test(label),
    readOnly: /\b(?:readonly|disabled)\b/i.test(tag),
    options: readYouthGuaranteeControlOptions(html, tag),
  }
}
