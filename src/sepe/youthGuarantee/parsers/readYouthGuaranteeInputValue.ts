import { readAttribute } from '../../../html/readAttribute'
import { unescapeHtml } from '../../../html/unescapeHtml'

/** confirmaCorreo is identified only by id, not by a submitted name. */
export const readYouthGuaranteeInputValue = (
  html: string,
  id: string,
): string | undefined => {
  const tag = [...html.matchAll(/<input\b[^>]*>/gi)].find(
    ([input]) => readAttribute(input, 'id') === id,
  )?.[0]
  return tag === undefined
    ? undefined
    : unescapeHtml(readAttribute(tag, 'value') ?? '')
}
