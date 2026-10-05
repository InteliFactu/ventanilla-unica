import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { dgsfpUrls } from './dgsfpUrls'
import { readRequestDigest } from './readRequestDigest'
import { walkClaveRelay } from './walkClaveRelay'

/**
 * Log the holder in through Cl@ve with the certificate and land on the
 * complaint form. The public procedure page gives a form digest; with it
 * `createClave2Request?u=<form page>` answers the SAML request
 * (`{action, method, samlRequest, relayState}`) that the page's "Cl@ve" link
 * posts. The chooser is answered with the certificate IdP, as CIRBE's is.
 */
export const loginWithCertificate = async (
  client: HttpClient,
): Promise<HttpResponse> => {
  const publicPage = await client.request(dgsfpUrls.procedurePage)
  const digest = readRequestDigest(publicPage.text)
  if (digest === undefined)
    throw new Error(`DGSFP: no form digest at ${publicPage.url}`)
  const answer = await client.request(
    `${dgsfpUrls.claveRequest}${encodeURI(dgsfpUrls.formPage)}`,
    { headers: { 'X-RequestDigest': digest, Accept: 'application/json' } },
  )
  const saml = JSON.parse(answer.text) as {
    readonly action: string
    readonly samlRequest: string
    readonly relayState: string
  }
  const chooserPage = await client.request(saml.action, {
    method: 'POST',
    form: { SAMLRequest: saml.samlRequest, RelayState: saml.relayState },
    referer: publicPage.url,
    headers: { Origin: dgsfpUrls.origin },
  })
  const chooser = selectIdpChooserForm(chooserPage.text, chooserPage.url)
  if (!chooser)
    throw new Error(`DGSFP: no Cl@ve IdP chooser at ${chooserPage.url}`)
  const relay = await postForm(
    client,
    chooser,
    { SelectedIdP: dgsfpUrls.certificateIdp },
    { referer: chooserPage.url, headers: { Origin: dgsfpUrls.claveOrigin } },
  )
  return walkClaveRelay(client, relay)
}
