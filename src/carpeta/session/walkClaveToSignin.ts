import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { mapSamlHop } from '../../sepe/session/mappers/mapSamlHop'
import { selectSamlHopForm } from '../../sepe/session/selectors/selectSamlHopForm'
import { carpetaUrls } from './carpetaUrls'

/**
 * Play Keycloak's broker page, the Cl@ve chooser (answered with the
 * certificate IdP), ServiceRedirect, AuthenticateCitizen (mTLS) and
 * ResponseRedirect until the browser would land on the Carpeta's `/signin`.
 * Every hop posts with its own origin: Cl@ve answers an empty page otherwise.
 */
export const walkClaveToSignin = async (
  client: HttpClient,
  entry: HttpResponse,
): Promise<HttpResponse> => {
  const maxHops = 10
  let response = entry
  for (let hop = 0; hop < maxHops; hop += 1) {
    if (response.url.startsWith(carpetaUrls.signin)) return response
    const chooser = /SelectedIdP/.test(response.text)
      ? selectIdpChooserForm(response.text, response.url)
      : undefined
    const headers = { Origin: new URL(response.url).origin }
    if (chooser) {
      response = await postForm(
        client,
        chooser,
        { SelectedIdP: carpetaUrls.certificateIdp },
        { referer: response.url, headers },
      )
      continue
    }
    const form = selectSamlHopForm(response.text, response.url)
    if (!form) break
    const next = mapSamlHop(form, response.url)
    response = await client.request(next.url, {
      method: 'POST',
      form: next.fields,
      referer: response.url,
      headers,
      timeoutMs: 120_000,
    })
  }
  throw new Error(
    `Carpeta: the Cl@ve relay did not come back to the Carpeta (last ${String(response.status)} at ${response.url})`,
  )
}
