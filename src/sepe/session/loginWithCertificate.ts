import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { parseFirstForm } from '../../html/parsers/parseFirstForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { sepeUrls } from './sepeUrls'
import { validateSepeServiceAvailable } from './validators/validateSepeServiceAvailable'
import { walkSamlChain } from './walkSamlChain'

/**
 * Open one SEPE service under the certificate holder. GetAccess answers the
 * SSO init with a SAML form for Cl@ve, which needs the SEPE Origin or it
 * refuses with `invalid.sp.domain`; the IdP chooser is answered with the
 * certificate option (`AFIRMA`) under the Cl@ve Origin; the rest is the relay
 * `walkSamlChain` plays. Resolves to the service page, authenticated, or
 * throws when the sede lands on its maintenance answer instead.
 */
export const loginWithCertificate = async (
  client: HttpClient,
  serviceUrl: string,
): Promise<HttpResponse> => {
  const init = await client.request(sepeUrls.ssoInit(serviceUrl))
  const entry = parseFirstForm(init.text, init.url)
  if (!entry)
    throw new Error(
      `SEPE: no SAML entry form at ${init.url} (${String(init.status)})`,
    )
  const chooserPage = await postForm(
    client,
    entry,
    {},
    { referer: init.url, headers: { Origin: sepeUrls.sepeOrigin } },
  )
  const chooser = selectIdpChooserForm(chooserPage.text, chooserPage.url)
  if (!chooser)
    throw new Error(
      `SEPE: no IdP chooser at ${chooserPage.url} (${String(chooserPage.status)})`,
    )
  const relay = await postForm(
    client,
    chooser,
    { SelectedIdP: sepeUrls.certificateIdp },
    { referer: chooserPage.url, headers: { Origin: sepeUrls.claveOrigin } },
  )
  return validateSepeServiceAvailable(await walkSamlChain(client, relay))
}
