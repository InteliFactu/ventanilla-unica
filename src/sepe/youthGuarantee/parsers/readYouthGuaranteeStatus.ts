import { htmlToText } from '../../../html/htmlToText'
import type { YouthGuaranteeStatus } from '../types/YouthGuaranteeStatus'
import { isInitialYouthGuaranteeDraft } from '../validators/isInitialYouthGuaranteeDraft'
import { readYouthGuaranteeState } from './readYouthGuaranteeState'

/** Missing dates or links alone never establish that the holder is unregistered. */
export const readYouthGuaranteeStatus = (
  html: string,
): YouthGuaranteeStatus => {
  const text = htmlToText(html.replaceAll(/<!--[\s\S]*?-->/g, ''))
  const date =
    /Fecha de inscripci[oó]n(?: :|:)? (\d{2}\/\d{2}\/\d{4})/i.exec(text)?.[1] ??
    null
  const state = readYouthGuaranteeState(text)
  if (state)
    return {
      inscribed: state === 'pendiente' ? null : true,
      state,
      registrationDate: date,
      evidence: [text.match(/Estado[^.]{0,100}/i)?.[0] ?? state],
    }
  if (isInitialYouthGuaranteeDraft(html))
    return {
      inscribed: false,
      state: 'not-inscribed',
      registrationDate: null,
      evidence: [
        'The portal opened the inscription wizard, state code 01, with no consolidated application.',
      ],
    }
  return {
    inscribed: null,
    state: 'unknown',
    registrationDate: date,
    evidence: ['The authenticated page did not establish registration status.'],
  }
}
