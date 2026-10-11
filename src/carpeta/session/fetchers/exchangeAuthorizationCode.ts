import type { HttpClient } from '../../../http/types/HttpClient'
import { carpetaUrls } from '../carpetaUrls'
import { readStringField } from '../parsers/readStringField'

/** Trade the authorization code for a Keycloak access token (public client, PKCE verifier as proof). */
export const exchangeAuthorizationCode = async (
  client: HttpClient,
  code: string,
  verifier: string,
): Promise<string> => {
  const response = await client.request(`${carpetaUrls.oidc}/token`, {
    method: 'POST',
    form: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: carpetaUrls.signin,
      client_id: carpetaUrls.clientId,
      code_verifier: verifier,
    },
  })
  return readStringField(response.text, 'access_token', 'the token endpoint')
}
