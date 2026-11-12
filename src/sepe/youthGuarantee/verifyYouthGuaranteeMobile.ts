import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { postYouthGuaranteeAction } from './fetchers/postYouthGuaranteeAction'
import { mapYouthGuaranteeVerification } from './mappers/mapYouthGuaranteeVerification'
import { obtainYouthGuaranteeMobileCode } from './obtainYouthGuaranteeMobileCode'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeVerificationFiles } from './types/YouthGuaranteeVerificationFiles'
import { isYouthGuaranteeMobileVerified } from './validators/isYouthGuaranteeMobileVerified'

export const verifyYouthGuaranteeMobile = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  files: YouthGuaranteeVerificationFiles,
): Promise<HttpResponse> => {
  if (isYouthGuaranteeMobileVerified(page.text, answers)) return page
  const code = await obtainYouthGuaranteeMobileCode(
    client,
    page,
    answers,
    files,
  )
  const form = mapYouthGuaranteeVerification(code.page, answers, 'confirmarOTP')
  const verified = await postYouthGuaranteeAction(
    client,
    code.page,
    { ...form, fields: { ...form.fields, pinSMS: code.pin } },
    'mobile code confirmation',
  )
  if (!isYouthGuaranteeMobileVerified(verified.text, answers))
    throw new Error(
      'Garantía Juvenil: mobile verification failed (confirmaMovil is not 1 for the declared mobile); inscription stopped',
    )
  return verified
}
