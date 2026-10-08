import type { HttpClient } from '../../../http/types/HttpClient'
import { nicBaseUrl } from '../../nicBaseUrl'
import type { NicMultipartBody } from '../types/NicMultipartBody'

/** Post the signed request; the answer page carries Red.es's verdict. */
export const submitEmailChange = async (
  client: HttpClient,
  multipart: NicMultipartBody,
): Promise<string> => {
  const response = await client.request(
    `${nicBaseUrl}/peticion/editarContacto.action`,
    {
      method: 'POST',
      body: multipart.body,
      headers: { 'Content-Type': multipart.contentType },
      referer: `${nicBaseUrl}/peticion/editCorreo.action`,
      defaultCharset: 'latin1',
    },
  )
  return response.text
}
