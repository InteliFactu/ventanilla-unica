import type { HttpClient } from '../../http/types/HttpClient'
import { sesUrls } from '../session/sesUrls'
import { parseSesContactPage } from './parsers/parseSesContactPage'
import type { SesContact } from './types/SesContact'

/**
 * Log in to Centro de Salud Online with the certificate and read the e-mail
 * and phones of "Mis datos". The login's redirect to the plain-HTTP home is not
 * followed: the 302 already carries the session cookie, and the page is read
 * over HTTPS. Opening the page changes nothing.
 */
export const readSesContact = async (
  client: HttpClient,
): Promise<SesContact> => {
  await client.request(sesUrls.certificateLogin, { followRedirects: false })
  const page = await client.request(sesUrls.personalData)
  if (page.status !== 200)
    throw new Error(
      `Centro de Salud Online: Mis datos answered HTTP ${String(page.status)}`,
    )
  return parseSesContactPage(page.text)
}
