import { parseFirstForm } from '../../../html/parsers/parseFirstForm'
import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { HttpClient } from '../../../http/types/HttpClient'
import { apiHeaders } from '../../api/apiHeaders'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'

/**
 * PUT `v1/contact/<base64 NIF>` with the new contact. DEHU does not apply it
 * here: it answers, as a JSON string of HTML, the Cl@ve form whose
 * re-authentication confirms the change (the front auto-submits it).
 */
export const putDehuContact = async (
  client: HttpClient,
  authData: string,
  nif: string,
  body: Readonly<Record<string, unknown>>,
): Promise<HtmlForm> => {
  const response = await client.request(
    `${dehuUrls.contact}${Buffer.from(nif).toString('base64')}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { ...apiHeaders(authData), 'Content-Type': 'application/json' },
      referer: `${dehuUrls.base}/es/contact-and-notices`,
    },
  )
  if (response.status !== 200)
    throw new Error(
      `DEHU: contact update answered HTTP ${String(response.status)}`,
    )
  const html = parseJsonResponse(response, 'contact update')
  const form =
    typeof html === 'string' ? parseFirstForm(html, dehuUrls.base) : undefined
  if (!form) throw new Error('DEHU: no Cl@ve form in the contact update answer')
  return form
}
