import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { parseFirstForm } from '../../html/parsers/parseFirstForm'
import { parseMetaRefreshUrl } from '../../html/parsers/parseMetaRefreshUrl'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { walkSamlChain } from '../../sepe/session/walkSamlChain'
import { justiciaUrls } from './justiciaUrls'

/**
 * Open a Carpeta Justicia session under the certificate holder. The Liferay
 * login lands on `selfservice-ext/login`, whose meta refresh opens
 * `am.justicia.es/.../login/clave`; that page's only form carries the SAML
 * request to Cl@ve (its action is entity-encoded, so it is read with the
 * generic form parser). The chooser is answered with the certificate IdP and
 * the relay ends on `/group/guest/home`.
 */
export const loginWithCertificate = async (
  client: HttpClient,
): Promise<HttpResponse> => {
  const login = await client.request(justiciaUrls.login)
  const samlPageUrl = parseMetaRefreshUrl(login.text, login.url)
  if (!samlPageUrl)
    throw new Error(`Justicia: no Cl@ve redirect at ${login.url}`)
  const samlPage = await client.request(samlPageUrl, { referer: login.url })
  const entry = parseFirstForm(samlPage.text, samlPage.url)
  if (!entry)
    throw new Error(`Justicia: no SAML request form at ${samlPage.url}`)
  const chooserPage = await postForm(
    client,
    entry,
    {},
    { referer: samlPage.url },
  )
  const chooser = selectIdpChooserForm(chooserPage.text, chooserPage.url)
  if (!chooser)
    throw new Error(`Justicia: no Cl@ve IdP chooser at ${chooserPage.url}`)
  const relay = await postForm(
    client,
    chooser,
    { SelectedIdP: justiciaUrls.certificateIdp },
    { referer: chooserPage.url, headers: { Origin: justiciaUrls.claveOrigin } },
  )
  const landed = await walkSamlChain(client, relay)
  if (
    new URL(landed.url).origin !== justiciaUrls.origin ||
    landed.status !== 200
  )
    throw new Error(
      `Justicia: the Cl@ve relay ended at ${landed.url} (${String(landed.status)})`,
    )
  return landed
}
