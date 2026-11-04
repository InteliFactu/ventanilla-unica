import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { fetchYouthGuaranteeEmailLink } from './fetchers/fetchYouthGuaranteeEmailLink'
import { postYouthGuaranteeAction } from './fetchers/postYouthGuaranteeAction'
import { waitForYouthGuaranteeFile } from './fetchers/waitForYouthGuaranteeFile'
import { mapYouthGuaranteeVerification } from './mappers/mapYouthGuaranteeVerification'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import { isYouthGuaranteeEmailVerified } from './validators/isYouthGuaranteeEmailVerified'
import { validateYouthGuaranteePage } from './validators/validateYouthGuaranteePage'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

export const verifyYouthGuaranteeEmail = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  linkFile: string,
): Promise<HttpResponse> => {
  if (isYouthGuaranteeEmailVerified(page.text, answers)) return page
  await postYouthGuaranteeAction(
    client,
    page,
    mapYouthGuaranteeVerification(page, answers, 'confirmarCorreo'),
    'email verification request',
  )
  process.stderr.write(
    'Garantía Juvenil: verification email requested. Write the received HTTPS link to --enlace-fichero; waiting up to 30 minutes.\n',
  )
  await fetchYouthGuaranteeEmailLink(
    client,
    await waitForYouthGuaranteeFile(linkFile, 'link'),
  )
  const verified = validateYouthGuaranteePage(
    await client.request(youthGuaranteeUrls.page(2), {
      followRedirects: false,
    }),
  )
  if (!isYouthGuaranteeEmailVerified(verified.text, answers))
    throw new Error(
      'Garantía Juvenil: email verification failed (confirmaCorreo is not 1 for the declared email); inscription stopped',
    )
  return verified
}
