import type { HttpClient } from '../../http/types/HttpClient'
import { buildAuthorizationUrl } from './builders/buildAuthorizationUrl'
import { buildPkcePair } from './builders/buildPkcePair'
import { exchangeAuthorizationCode } from './fetchers/exchangeAuthorizationCode'
import { fetchCarpetaToken } from './fetchers/fetchCarpetaToken'
import { readAuthorizationCode } from './parsers/readAuthorizationCode'
import { walkClaveToSignin } from './walkClaveToSignin'

/** Log the holder into the Carpeta Ciudadana with the certificate and return the token its `/api` expects. */
export const loginWithCertificate = async (
  client: HttpClient,
): Promise<string> => {
  const pkce = buildPkcePair()
  const entry = await client.request(buildAuthorizationUrl(pkce))
  const signin = await walkClaveToSignin(client, entry)
  const code = readAuthorizationCode(signin.url, pkce.state)
  const accessToken = await exchangeAuthorizationCode(
    client,
    code,
    pkce.verifier,
  )
  return fetchCarpetaToken(client, accessToken)
}
