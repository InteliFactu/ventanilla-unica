import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { fetchYouthGuaranteeEmailLink } from './fetchers/fetchYouthGuaranteeEmailLink'
import { obtainYouthGuaranteeEmailLink } from './obtainYouthGuaranteeEmailLink'
import type { YouthGuaranteeAnswers } from './types/YouthGuaranteeAnswers'
import type { YouthGuaranteeVerificationFiles } from './types/YouthGuaranteeVerificationFiles'
import { isYouthGuaranteeEmailVerified } from './validators/isYouthGuaranteeEmailVerified'
import { validateYouthGuaranteePage } from './validators/validateYouthGuaranteePage'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

export const verifyYouthGuaranteeEmail = async (
  client: HttpClient,
  page: HttpResponse,
  answers: YouthGuaranteeAnswers,
  files: YouthGuaranteeVerificationFiles,
): Promise<HttpResponse> => {
  if (isYouthGuaranteeEmailVerified(page.text, answers)) return page
  await fetchYouthGuaranteeEmailLink(
    client,
    await obtainYouthGuaranteeEmailLink(client, page, answers, files),
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
