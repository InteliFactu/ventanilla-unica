import type { HttpClient } from '../../../http/types/HttpClient'
import { carpetaUrls } from '../carpetaUrls'
import { readStringField } from '../parsers/readStringField'

/** Trade the Keycloak access token for the Carpeta's own API token, as the front's `/signin` page does. */
export const fetchCarpetaToken = async (
  client: HttpClient,
  accessToken: string,
): Promise<string> => {
  const response = await client.request(carpetaUrls.carpetaToken, {
    headers: { Authorization: accessToken, Accept: 'application/json' },
  })
  return readStringField(response.text, 'token', 'create-cc-token')
}
