import { readAttribute } from '../../../html/readAttribute'
import type { HtmlForm } from '../../../html/types/HtmlForm'
import { unescapeHtml } from '../../../html/unescapeHtml'
import { readYouthGuaranteeFields } from '../parsers/readYouthGuaranteeFields'
import { readYouthGuaranteeForm } from '../parsers/readYouthGuaranteeForm'
import { readYouthGuaranteeFormHtml } from '../parsers/readYouthGuaranteeFormHtml'
import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import { youthGuaranteeUrls } from '../youthGuaranteeUrls'

/** Re-read tokens and submit exactly the live page's forward button. */
export const mapYouthGuaranteeSubmission = (
  html: string,
  url: string,
  step: number,
  answers: YouthGuaranteeAnswers,
): HtmlForm => {
  const form = readYouthGuaranteeForm(html, url, step)
  const expected = `${youthGuaranteeUrls.page(step)}Token.action`
  if (
    form.action !== expected ||
    !form.fields['struts.token.name'] ||
    !form.fields['token']
  )
    throw new Error(
      'Garantía Juvenil: inscription action or CSRF token changed; nothing was submitted for this step',
    )
  const buttonName =
    step === 6 ? 'confirmarInscripcion' : step === 2 ? 'validar' : 'siguiente'
  const button = [
    ...readYouthGuaranteeFormHtml(html, step).matchAll(/<input\b[^>]*>/gi),
  ].find(([tag]) => readAttribute(tag, 'name') === buttonName)?.[0]
  if (!button) throw new Error('Garantía Juvenil: missing forward button')
  const fields = readYouthGuaranteeFields(html)
  const declared = Object.fromEntries(
    Object.entries(answers[String(step)] ?? {}).filter(
      ([name, value]) =>
        value !== 'false' ||
        fields.find((field) => field.name === name)?.type !== 'checkbox',
    ),
  )
  return {
    action: form.action,
    fields: {
      ...form.fields,
      ...declared,
      [buttonName]: unescapeHtml(readAttribute(button, 'value') ?? ''),
    },
  }
}
