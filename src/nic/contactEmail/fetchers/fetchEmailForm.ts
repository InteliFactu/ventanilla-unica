import type { HttpClient } from '../../../http/types/HttpClient'
import { nicBaseUrl } from '../../nicBaseUrl'

/** The public email change form; opening it starts the session and issues the token to sign. */
export const fetchEmailForm = async (client: HttpClient): Promise<string> => {
  const response = await client.request(
    `${nicBaseUrl}/peticion/editCorreo.action`,
    { defaultCharset: 'latin1' },
  )
  return response.text
}
