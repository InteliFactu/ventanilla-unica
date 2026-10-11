import type { HttpClient } from '../../../http/types/HttpClient'
import { apiHeaders } from '../../api/apiHeaders'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'

/**
 * GET `v1/contact/<base64 NIF>`. The front base64-encodes the NIF in the
 * path; the plain NIF answers 403 with an empty body.
 */
export const fetchDehuContact = async (
  client: HttpClient,
  authData: string,
  nif: string,
): Promise<unknown> => {
  const response = await client.request(
    `${dehuUrls.contact}${Buffer.from(nif).toString('base64')}`,
    { headers: apiHeaders(authData) },
  )
  if (response.status !== 200)
    throw new Error(`DEHU: contact answered HTTP ${String(response.status)}`)
  return parseJsonResponse(response, 'contact')
}
