import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { mapSamlHop } from '../../sepe/session/mappers/mapSamlHop'
import { selectSamlHopForm } from '../../sepe/session/selectors/selectSamlHopForm'
import { dgsfpUrls } from './dgsfpUrls'

/**
 * Play the Cl@ve relay after the IdP choice until it lands back on the sede:
 * ServiceRedirect, AuthenticateCitizen (mTLS), ResponseRedirect, then the
 * sede's `ResponseLoginClave.aspx`, which sets `FedAuth` and redirects to the
 * return URL. The walk stops on the sede's host rather than on the first page
 * without a SAML field, because the sede's own pages carry ASP.NET forms.
 */
export const walkClaveRelay = async (
  client: HttpClient,
  entry: HttpResponse,
): Promise<HttpResponse> => {
  const maxHops = 6
  const sedeHost = new URL(dgsfpUrls.origin).host
  let response = entry
  for (let hop = 0; hop < maxHops; hop += 1) {
    if (new URL(response.url).host === sedeHost) return response
    const form = selectSamlHopForm(response.text, response.url)
    if (!form) break
    const next = mapSamlHop(form, response.url)
    response = await client.request(next.url, {
      method: 'POST',
      form: next.fields,
      referer: response.url,
      timeoutMs: 120_000,
    })
  }
  throw new Error(
    `DGSFP: the Cl@ve relay did not reach the sede (last ${String(response.status)} at ${response.url})`,
  )
}
