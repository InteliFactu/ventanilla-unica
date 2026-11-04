import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { selectSamlHopForm } from '../session/selectors/selectSamlHopForm'
import { sepeUrls } from '../session/sepeUrls'
import { walkSamlChain } from '../session/walkSamlChain'
import { validateYouthGuaranteePage } from './validators/validateYouthGuaranteePage'
import { youthGuaranteeUrls } from './youthGuaranteeUrls'

/** The site's loginClave entry uses its own SAML request and Spring callback. */
export const loginYouthGuarantee = async (
  client: HttpClient,
): Promise<HttpResponse> => {
  const entry = await client.request(youthGuaranteeUrls.login)
  const form = selectSamlHopForm(entry.text, entry.url)
  if (!form) throw new Error('Garantía Juvenil: missing Cl@ve SAML entry')
  const chooserPage = await postForm(
    client,
    form,
    {},
    {
      referer: entry.url,
      headers: { Origin: youthGuaranteeUrls.origin },
    },
  )
  const chooser = selectIdpChooserForm(chooserPage.text, chooserPage.url)
  if (!chooser)
    throw new Error('Garantía Juvenil: missing Cl@ve certificate chooser')
  const relay = await postForm(
    client,
    chooser,
    { SelectedIdP: sepeUrls.certificateIdp },
    {
      referer: chooserPage.url,
      headers: { Origin: sepeUrls.claveOrigin },
    },
  )
  return validateYouthGuaranteePage(await walkSamlChain(client, relay))
}
