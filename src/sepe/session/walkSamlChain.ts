import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { mapSamlHop } from './mappers/mapSamlHop'
import { selectSamlHopForm } from './selectors/selectSamlHopForm'

/**
 * Play the Cl@ve relay after the IdP choice: every page carrying a SAML form
 * is posted to its real target (the `idpUrl` field or the action) with the
 * page as Referer, plus any headers the caller adds; the certificate is presented by mTLS on the
 * AuthenticateCitizen hop. The walk ends on the first page without a SAML
 * form, which is the service (SEPE, CIRBE, the Junta sede).
 */
export const walkSamlChain = async (
  client: HttpClient,
  entry: HttpResponse,
  headers?: Readonly<Record<string, string>>,
): Promise<HttpResponse> => {
  const maxHops = 5
  const hopTimeoutMs = 120_000
  let response = entry
  for (let hop = 0; hop < maxHops; hop += 1) {
    const form = selectSamlHopForm(response.text, response.url)
    if (!form) return response
    const next = mapSamlHop(form, response.url)
    response = await client.request(next.url, {
      method: 'POST',
      form: next.fields,
      referer: response.url,
      headers,
      timeoutMs: hopTimeoutMs,
    })
  }
  throw new Error(
    `Cl@ve: the relay did not settle after ${String(maxHops)} hops (last ${String(response.status)} at ${response.url})`,
  )
}
