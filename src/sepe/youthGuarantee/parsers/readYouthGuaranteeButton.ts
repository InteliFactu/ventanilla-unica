import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'
import { readYouthGuaranteeFormHtml } from './readYouthGuaranteeFormHtml'

export const readYouthGuaranteeButton = (
  html: string,
  step: number,
  name: string,
): string => {
  const tag = [
    ...readYouthGuaranteeFormHtml(html, step).matchAll(/<input\b[^>]*>/gi),
  ].find(
    ([input]) =>
      readAttribute(input, 'type') === 'submit' &&
      readAttribute(input, 'name') === name,
  )?.[0]
  if (!tag)
    throw new Error('Garantía Juvenil: missing inscription action button')
  return unescapeHtml(readAttribute(tag, 'value') ?? '')
}
