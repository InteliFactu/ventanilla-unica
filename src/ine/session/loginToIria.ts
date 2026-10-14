import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { readViewState } from '../../gobex/notifications/parsers/readViewState'
import { parseFirstForm } from '../../html/parsers/parseFirstForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { walkSamlChain } from '../../sepe/session/walkSamlChain'
import { postIriaAjax } from '../fetchers/postIriaAjax'
import { readPartialRedirect } from '../parsers/readPartialRedirect'
import { iriaUrls } from './iriaUrls'

/**
 * One certificate login to IRIA: the "Entrar con cl@ve" button answers a
 * partial redirect to `servicios.ine.es`, whose auto-submitting form opens the
 * Cl@ve pasarela; the certificate IdP is chosen and the SAML relay lands back
 * on the portal, on the survey list or the questionnaires of the only survey.
 */
export const loginToIria = async (
  client: HttpClient,
): Promise<HttpResponse> => {
  const home = await client.request(iriaUrls.home)
  const viewState = readViewState(home.text)
  if (!viewState) throw new Error('IRIA: no ViewState on the home page')
  const button = await postIriaAjax(client, iriaUrls.home, {
    form: 'formLoginAccesoUnico',
    source: 'formLoginAccesoUnico:loginButtonAccesoClave',
    viewState,
  })
  const redirect = readPartialRedirect(button.text)
  if (!redirect) throw new Error('IRIA: the Cl@ve button did not redirect')
  const front = await client.request(redirect, { referer: iriaUrls.home })
  const toPasarela = parseFirstForm(front.text, front.url)
  if (!toPasarela) throw new Error(`IRIA: no Cl@ve form at ${front.url}`)
  const pasarela = await postForm(
    client,
    toPasarela,
    {},
    { referer: front.url },
  )
  const chooser = selectIdpChooserForm(pasarela.text, pasarela.url)
  const relay = chooser
    ? await postForm(
        client,
        chooser,
        { SelectedIdP: iriaUrls.certificateIdp },
        { referer: pasarela.url, headers: { Origin: iriaUrls.claveOrigin } },
      )
    : pasarela
  return walkSamlChain(client, relay)
}
