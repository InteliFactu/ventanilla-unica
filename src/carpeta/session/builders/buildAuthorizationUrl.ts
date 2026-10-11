import { carpetaUrls } from '../carpetaUrls'
import type { PkcePair } from '../types/PkcePair'

/** The Keycloak authorization request the Carpeta front sends, with the certificate IdP preselected. */
export const buildAuthorizationUrl = (pkce: PkcePair): string => {
  const query = new URLSearchParams({
    client_id: carpetaUrls.clientId,
    redirect_uri: carpetaUrls.signin,
    response_type: 'code',
    scope: 'openid',
    acr_values: carpetaUrls.acrValues,
    state: pkce.state,
    code_challenge: pkce.challenge,
    code_challenge_method: 'S256',
  })
  return `${carpetaUrls.oidc}/auth?${query.toString()}`
}
