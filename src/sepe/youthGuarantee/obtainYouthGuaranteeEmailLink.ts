import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { readReusedYouthGuaranteeFile } from './fetchers/readReusedYouthGuaranteeFile'
import { requestYouthGuaranteeEmailLink } from './requestYouthGuaranteeEmailLink'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeVerificationFiles } from './types/YouthGuaranteeVerificationFiles'

export const obtainYouthGuaranteeEmailLink = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  files: YouthGuaranteeVerificationFiles,
): Promise<string> => {
  const linkFile = files.linkFile ?? ''
  if (files.emailIntent === 'solicitar')
    return requestYouthGuaranteeEmailLink(client, page, answers, linkFile)
  if (files.emailIntent === 'reutilizar')
    return readReusedYouthGuaranteeFile(linkFile, 'link')
  throw new Error(
    'Garantía Juvenil: email verification needs --correo solicitar or reutilizar; nothing was sent',
  )
}
