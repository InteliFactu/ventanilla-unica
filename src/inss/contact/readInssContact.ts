import type { HttpClient } from '../../http/types/HttpClient'
import { loginToSeguridadSocialPortal } from '../../tgss/session/loginToSeguridadSocialPortal'
import { tussUrls } from '../session/tussUrls'
import { parseInssContactPage } from './parsers/parseInssContactPage'
import type { InssContact } from './types/InssContact'

/**
 * Log in to Tu Seguridad Social and read the mobile and e-mail of "Tus
 * datos". Opening the page changes nothing; the "EDITAR" links stay unfollowed.
 */
export const readInssContact = async (
  client: HttpClient,
): Promise<InssContact> => {
  await loginToSeguridadSocialPortal(client, tussUrls.entry, tussUrls.host)
  const page = await client.request(tussUrls.personalData)
  return parseInssContactPage(page.text)
}
