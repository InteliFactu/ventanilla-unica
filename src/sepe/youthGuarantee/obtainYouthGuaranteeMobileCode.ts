import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { readReusedYouthGuaranteeFile } from './fetchers/readReusedYouthGuaranteeFile'
import { requestYouthGuaranteeMobileCode } from './requestYouthGuaranteeMobileCode'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeMobileCode } from './types/YouthGuaranteeMobileCode'
import type { YouthGuaranteeVerificationFiles } from './types/YouthGuaranteeVerificationFiles'

export const obtainYouthGuaranteeMobileCode = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  files: YouthGuaranteeVerificationFiles,
): Promise<YouthGuaranteeMobileCode> => {
  const pinFile = files.pinFile ?? ''
  if (files.mobileIntent === 'solicitar')
    return requestYouthGuaranteeMobileCode(client, page, answers, pinFile)
  if (files.mobileIntent === 'reutilizar')
    return { page, pin: await readReusedYouthGuaranteeFile(pinFile, 'pin') }
  throw new Error(
    'Garantía Juvenil: mobile verification needs --sms solicitar or reutilizar; nothing was sent',
  )
}
