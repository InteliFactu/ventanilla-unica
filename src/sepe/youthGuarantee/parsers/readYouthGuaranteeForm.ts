import { parseFirstForm } from '../../../html/parsers/parseFirstForm'
import { readAttribute } from '../../../html/readAttribute'
import type { HtmlForm } from '../../../html/types/HtmlForm'
import { readYouthGuaranteeFormHtml } from './readYouthGuaranteeFormHtml'

/** Target the inner wizard form; the live page contains a surrounding form. */
export const readYouthGuaranteeForm = (
  html: string,
  baseUrl: string,
  step: number,
): HtmlForm => {
  const block = readYouthGuaranteeFormHtml(html, step)
  const form = parseFirstForm(block, baseUrl)
  if (!form)
    throw new Error(
      `Garantía Juvenil: missing inscription page ${String(step)}`,
    )
  const inputs: Record<string, string> = {}
  for (const [tag] of block.matchAll(/<input\b[^>]*>/gi)) {
    const name = readAttribute(tag, 'name')
    if (
      name &&
      (readAttribute(tag, 'type') === 'hidden' || /\breadonly\b/i.test(tag))
    )
      inputs[name] = form.fields[name] ?? ''
  }
  return { action: form.action, fields: inputs }
}
