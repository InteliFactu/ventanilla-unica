import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { selectSamlRelayForm } from '../../dehu/session/selectors/selectSamlRelayForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { walkSamlChain } from '../../sepe/session/walkSamlChain'
import { dgtUrls } from './dgtUrls'

/**
 * Open a protected DGT sede page under the certificate holder. The page
 * answers 401 with an auto-submitting SAML form for Cl@ve; the chooser is
 * answered with the certificate IdP and the relay ends back on the page,
 * which sets the `Path=/es` session cookies (`LtpaToken2`, `DPCKUIE`).
 */
export const loginWithCertificate = async (
  client: HttpClient,
  pageUrl: string,
): Promise<HttpResponse> => {
  const protectedPage = await client.request(pageUrl)
  const entry = selectSamlRelayForm(protectedPage.text, protectedPage.url)
  if (!entry)
    throw new Error(
      `DGT: no Cl@ve SAML form at ${protectedPage.url} (${String(protectedPage.status)})`,
    )
  const chooserPage = await postForm(client, entry, {}, { referer: pageUrl })
  const chooser = selectIdpChooserForm(chooserPage.text, chooserPage.url)
  if (!chooser)
    throw new Error(`DGT: no Cl@ve IdP chooser at ${chooserPage.url}`)
  const relay = await postForm(
    client,
    chooser,
    { SelectedIdP: dgtUrls.certificateIdp },
    { referer: chooserPage.url, headers: { Origin: dgtUrls.claveOrigin } },
  )
  const landed = await walkSamlChain(client, relay)
  if (new URL(landed.url).origin !== dgtUrls.origin || landed.status !== 200)
    throw new Error(
      `DGT: the Cl@ve relay ended at ${landed.url} (${String(landed.status)})`,
    )
  return landed
}
