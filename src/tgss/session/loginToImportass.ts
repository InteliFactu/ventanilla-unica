import { parseForms } from '../../html/parsers/parseForms'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { importassUrls } from './importassUrls'
import { readBaseHref } from './parsers/readBaseHref'
import { selectImportassRelayForm } from './selectors/selectImportassRelayForm'
import { tgssUrls } from './tgssUrls'

/**
 * Log in to Importass with the client's certificate: the redirector's login
 * form, the PGIS/IPCE SAML relay (the IdP chooser answered with an empty POST
 * to the certificate option, as `walkSamlChain` does) and the SAMLResponse
 * back to the portal, which sets `LtpaToken2`. That cookie ends the walk.
 */
export const loginToImportass = async (client: HttpClient): Promise<void> => {
  const maxHops = 12
  let response = await client.request(importassUrls.entry)
  for (let hop = 0; hop < maxHops; hop += 1) {
    if (client.cookie(importassUrls.host, 'LtpaToken2')) return
    const base = readBaseHref(response.text, response.url)
    const form = selectImportassRelayForm(parseForms(response.text, base))
    if (form) {
      const action = { ...form, action: form.action.split('#')[0] ?? '' }
      response = await postForm(client, action, {}, { referer: response.url })
      continue
    }
    if (!response.text.includes('seleccion='))
      throw new Error(`Importass: login stopped at ${response.url}`)
    response = await client.request(tgssUrls.certificateSelection, {
      method: 'POST',
      body: '',
      referer: response.url,
    })
  }
  if (!client.cookie(importassUrls.host, 'LtpaToken2'))
    throw new Error('Importass: no LtpaToken2 after the certificate login')
}
