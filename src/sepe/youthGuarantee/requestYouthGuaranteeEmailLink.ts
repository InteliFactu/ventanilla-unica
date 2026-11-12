import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { assertEmptyYouthGuaranteeFile } from './fetchers/assertEmptyYouthGuaranteeFile'
import { postYouthGuaranteeAction } from './fetchers/postYouthGuaranteeAction'
import { waitForYouthGuaranteeFile } from './fetchers/waitForYouthGuaranteeFile'
import { mapYouthGuaranteeVerification } from './mappers/mapYouthGuaranteeVerification'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'

export const requestYouthGuaranteeEmailLink = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  linkFile: string,
): Promise<string> => {
  await assertEmptyYouthGuaranteeFile(linkFile, 'link')
  await postYouthGuaranteeAction(
    client,
    page,
    mapYouthGuaranteeVerification(page, answers, 'confirmarCorreo'),
    'email verification request',
  )
  process.stderr.write(
    'Garantía Juvenil: verification email requested. Write the received HTTPS link to --enlace-fichero; waiting up to 30 minutes.\n',
  )
  return waitForYouthGuaranteeFile(linkFile, 'link')
}
