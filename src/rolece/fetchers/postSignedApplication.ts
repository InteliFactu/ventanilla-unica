import { encodeLatin1Form } from '../../http/encodeLatin1Form'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import type { SignedApplication } from '../types/SignedApplication'
import type { SigningScreen } from '../types/SigningScreen'

/**
 * File the application: what `firmaExito` submits once AutoFirma answers,
 * `firma` the signature in base64 and `xmlFirmado` its bytes (`decode64`),
 * in the page's ISO-8859-1 like every other field.
 */
export const postSignedApplication = async (
  client: HttpClient,
  screen: SigningScreen,
  signed: SignedApplication,
): Promise<HttpResponse> =>
  client.request(screen.action, {
    method: 'POST',
    referer: screen.url,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeLatin1Form({
      ...screen.fields,
      firma: signed.xml.toString('base64'),
      xmlFirmado: signed.xml.toString('latin1'),
    }),
  })
