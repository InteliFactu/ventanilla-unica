import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { readYouthGuaranteeButton } from '../parsers/readYouthGuaranteeButton'
import type { YouthGuaranteeAnswers } from '../types/YouthGuaranteeAnswers'
import { mapYouthGuaranteeSubmission } from './mapYouthGuaranteeSubmission'

/** A verification button saves step 2 without pressing Siguiente. */
export const mapYouthGuaranteeVerification = (
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  button: string,
): HtmlForm => {
  const form = mapYouthGuaranteeSubmission(page.text, page.url, 2, answers)
  const fields = { ...form.fields }
  delete fields['siguiente']
  return {
    action: form.action,
    fields: {
      ...fields,
      [button]: readYouthGuaranteeButton(page.text, 2, button),
    },
  }
}
