import type { HttpClient } from '../../../http/types/HttpClient'
import { apiHeaders } from '../../api/apiHeaders'
import { asRecord } from '../../api/asRecord'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'

/**
 * The id of the legal text the holder consents to when opening a
 * notification ("El acceso a la notificación supone..."). DEHU names it in
 * the re-authentication URL, so the acceptance is tied to the text in force.
 */
export const fetchAcceptLegalTextId = async (
  client: HttpClient,
  authData: string,
): Promise<string> => {
  const response = await client.request(dehuUrls.acceptLegalText, {
    headers: apiHeaders(authData),
    referer: dehuUrls.notificationsPage,
  })
  const id = asRecord(parseJsonResponse(response, 'legal text'))?.['id']
  if (typeof id !== 'number' && typeof id !== 'string')
    throw new Error('DEHU: the acceptance legal text carries no id')
  return String(id)
}
