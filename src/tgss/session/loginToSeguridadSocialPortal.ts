import { parseForms } from '../../html/parsers/parseForms'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { readBaseHref } from './parsers/readBaseHref'
import { selectImportassRelayForm } from './selectors/selectImportassRelayForm'
import { tgssUrls } from './tgssUrls'

/**
 * Log in to one of the Seguridad Social's WebSphere portals (Importass, Tu
 * Seguridad Social) with the client's certificate: the portal's login form,
 * the PGIS/IPCE SAML relay (the IdP chooser answered with an empty POST to the
 * certificate option, as `walkSamlChain` does) and the SAMLResponse back to the
 * portal, which sets `LtpaToken2` on `host`. That cookie ends the walk.
 */
export const loginToSeguridadSocialPortal = async (
  client: HttpClient,
  entry: string,
  host: string,
): Promise<void> => {
  const maxHops = 12
  let response = await client.request(entry)
  for (let hop = 0; hop < maxHops; hop += 1) {
    if (client.cookie(host, 'LtpaToken2')) return
    const base = readBaseHref(response.text, response.url)
    const form = selectImportassRelayForm(parseForms(response.text, base))
    if (form) {
      const action = { ...form, action: form.action.split('#')[0] ?? '' }
      response = await postForm(client, action, {}, { referer: response.url })
      continue
    }
    if (!response.text.includes('seleccion='))
      throw new Error(`${host}: login stopped at ${response.url}`)
    response = await client.request(tgssUrls.certificateSelection, {
      method: 'POST',
      body: '',
      referer: response.url,
    })
  }
  if (!client.cookie(host, 'LtpaToken2'))
    throw new Error(`${host}: no LtpaToken2 after the certificate login`)
}
