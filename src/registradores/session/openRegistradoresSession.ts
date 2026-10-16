import type { HttpClient } from '../../http/types/HttpClient'
import { walkSamlChain } from '../../sepe/session/walkSamlChain'
import { readCsrfToken } from './parsers/readCsrfToken'
import { registradoresHeaders } from './registradoresHeaders'
import { registradoresUrls } from './registradoresUrls'

/**
 * Log in to both service providers and answer the `_csrf` token of the
 * mercantil search. `login-certificado` runs the F5 certificate policy and
 * ends on an auto-post SAMLRequest; the IdP only accepts it with a Referer
 * (without one it bounces to the sede's home), which `walkSamlChain` sends.
 * The `site` application then asks the same IdP, which answers from the F5
 * session (the HttpOnly MRHSession cookie on `.registradores.org`), and lands
 * on `certificado/mercantil/busqueda`.
 */
export const openRegistradoresSession = async (
  client: HttpClient,
): Promise<string> => {
  const headers = registradoresHeaders
  await walkSamlChain(
    client,
    await client.request(registradoresUrls.certificateLogin, { headers }),
    headers,
  )
  const search = await walkSamlChain(
    client,
    await client.request(registradoresUrls.notaEntry, { headers }),
    headers,
  )
  const csrf = readCsrfToken(search.text)
  if (csrf === undefined || !search.url.includes('/mercantil/busqueda'))
    throw new Error(
      `registradores: the certificate login did not reach the mercantil search (landed on ${search.url.split('?')[0] ?? ''})`,
    )
  return csrf
}
