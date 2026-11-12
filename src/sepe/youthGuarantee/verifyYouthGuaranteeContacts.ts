import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeVerificationFiles } from './types/YouthGuaranteeVerificationFiles'
import { isYouthGuaranteeMobileVerified } from './validators/isYouthGuaranteeMobileVerified'
import { validateYouthGuaranteeContactIntents } from './validators/validateYouthGuaranteeContactIntents'
import { verifyYouthGuaranteeEmail } from './verifyYouthGuaranteeEmail'
import { verifyYouthGuaranteeMobile } from './verifyYouthGuaranteeMobile'

export const verifyYouthGuaranteeContacts = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  files: YouthGuaranteeVerificationFiles,
): Promise<HttpResponse> => {
  validateYouthGuaranteeContactIntents(page.text, answers, files)
  const mobile = await verifyYouthGuaranteeMobile(client, page, answers, files)
  const verified = await verifyYouthGuaranteeEmail(
    client,
    mobile,
    answers,
    files,
  )
  if (!isYouthGuaranteeMobileVerified(verified.text, answers))
    throw new Error(
      'Garantía Juvenil: mobile verification no longer valid; inscription stopped',
    )
  return verified
}
