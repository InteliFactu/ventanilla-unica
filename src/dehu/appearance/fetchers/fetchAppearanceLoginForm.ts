import { parseFirstForm } from '../../../html/parsers/parseFirstForm'
import type { HtmlForm } from '../../../html/types/HtmlForm'
import { apiHeaders } from '../../api/apiHeaders'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'
import type { AppearanceSession } from '../types/AppearanceSession'

/**
 * The Cl@ve form that starts the re-authentication DEHU demands before it
 * accepts a notification. Like the login form it comes as a JSON string of
 * HTML; its SAML request points back at a per-notification
 * `appearance-login-check`.
 */
export const fetchAppearanceLoginForm = async (
  session: AppearanceSession,
  reference: string,
): Promise<HtmlForm> => {
  const { client, authData, legalTextId } = session
  const path = `${encodeURIComponent(reference)}/appearance-login-form/aceptar/${encodeURIComponent(legalTextId)}`
  const response = await client.request(`${dehuUrls.pending}/${path}`, {
    headers: apiHeaders(authData),
    referer: `${dehuUrls.notificationsPage}/pending/${reference}/aceptar`,
  })
  const html = parseJsonResponse(response, 'appearance-login-form')
  const form =
    typeof html === 'string' ? parseFirstForm(html, dehuUrls.base) : undefined
  if (!form)
    throw new Error('DEHU: no Cl@ve form in the appearance-login-form answer')
  return form
}
