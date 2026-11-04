import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { postYouthGuaranteeAction } from './fetchers/postYouthGuaranteeAction'
import { waitForYouthGuaranteeFile } from './fetchers/waitForYouthGuaranteeFile'
import { mapYouthGuaranteeVerification } from './mappers/mapYouthGuaranteeVerification'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import { isYouthGuaranteeMobileVerified } from './validators/isYouthGuaranteeMobileVerified'

export const verifyYouthGuaranteeMobile = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  pinFile: string,
): Promise<HttpResponse> => {
  if (isYouthGuaranteeMobileVerified(page.text, answers)) return page
  const requested = await postYouthGuaranteeAction(
    client,
    page,
    mapYouthGuaranteeVerification(page, answers, 'confirmarMovil'),
    'mobile SMS request',
  )
  process.stderr.write(
    'Garantía Juvenil: SMS requested (valid for 4 hours). Write only the received digits to --pin-fichero; waiting up to 30 minutes.\n',
  )
  const pin = await waitForYouthGuaranteeFile(pinFile, 'pin')
  const form = mapYouthGuaranteeVerification(requested, answers, 'confirmarOTP')
  const verified = await postYouthGuaranteeAction(
    client,
    requested,
    { ...form, fields: { ...form.fields, pinSMS: pin } },
    'mobile code confirmation',
  )
  if (!isYouthGuaranteeMobileVerified(verified.text, answers))
    throw new Error(
      'Garantía Juvenil: mobile verification failed (confirmaMovil is not 1 for the declared mobile); inscription stopped',
    )
  return verified
}
