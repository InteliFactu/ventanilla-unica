import { readSelectOptions } from '../../../html/parsers/readSelectOptions'
import { readAttribute } from '../../../html/readAttribute'
import type { SelectOption } from '../../../html/types/SelectOption'
import { unescapeHtml } from '../../../html/unescapeHtml'
import { readYouthGuaranteeControlLabel } from './readYouthGuaranteeControlLabel'
import { readYouthGuaranteeLabel } from './readYouthGuaranteeLabel'

export const readYouthGuaranteeControlOptions = (
  html: string,
  tag: string,
): readonly SelectOption[] => {
  const name = readAttribute(tag, 'name') ?? ''
  if (!['radio', 'checkbox'].includes(readAttribute(tag, 'type') ?? ''))
    return readSelectOptions(html, name)
  return [
    {
      value: unescapeHtml(readAttribute(tag, 'value') ?? 'on'),
      label:
        readYouthGuaranteeLabel(html, readAttribute(tag, 'id') ?? name) ||
        readYouthGuaranteeControlLabel(html, tag),
    },
  ]
}
