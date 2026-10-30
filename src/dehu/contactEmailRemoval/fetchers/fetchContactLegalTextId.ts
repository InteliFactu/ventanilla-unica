import type { HttpClient } from '../../../http/types/HttpClient'
import { apiHeaders } from '../../api/apiHeaders'
import { asRecord } from '../../api/asRecord'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'

/** The id of the legal text the holder accepts on "Datos de contacto y avisos" (category 2, CONTACT, in the front's enum); the PUT names it. */
export const fetchContactLegalTextId = async (
  client: HttpClient,
  authData: string,
): Promise<string> => {
  const response = await client.request(
    `${dehuUrls.base}/api/v1/get_legal_text/2/es`,
    {
      headers: apiHeaders(authData),
      referer: `${dehuUrls.base}/es/contact-and-notices`,
    },
  )
  const id = asRecord(parseJsonResponse(response, 'contact legal text'))?.['id']
  if (typeof id !== 'number' && typeof id !== 'string')
    throw new Error('DEHU: the contact legal text carries no id')
  return String(id)
}
