import type { HtmlForm } from '../../html/types/HtmlForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { dehuUrls } from '../api/dehuUrls'
import { authenticateFromServiceProvider } from '../appearance/authenticateFromServiceProvider'
import { completeSamlResponseRelay } from '../session/completeSamlResponseRelay'

/** Walk the Cl@ve relay the contact update hands back, with the client's certificate, as the front's auto-submit would. */
export const confirmContactUpdate = async (
  client: HttpClient,
  form: HtmlForm,
): Promise<void> => {
  const servicePage = await postForm(
    client,
    form,
    {},
    { referer: dehuUrls.base },
  )
  const identityPage = await authenticateFromServiceProvider(
    client,
    servicePage,
  )
  await completeSamlResponseRelay(client, identityPage)
}
