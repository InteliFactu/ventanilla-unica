import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { parseFirstForm } from '../../html/parsers/parseFirstForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { walkSamlChain } from '../../sepe/session/walkSamlChain'
import { roleceUrls } from './roleceUrls'

/**
 * Log in to ROLECE under the certificate holder. `login.action` answers an
 * auto-submitting SAML form for the Cl@ve pasarela; ROLECE asks for the
 * certificate IdP only, so the pasarela usually skips the chooser and answers
 * the AuthenticateCitizen hop directly (the chooser is still answered when it
 * appears). The relay lands on `ReturnAction`, whose meta refresh points to
 * the private home, which carries the logout link once the session is open.
 */
export const openRoleceSession = async (client: HttpClient): Promise<void> => {
  const login = await client.request(roleceUrls.login)
  const entry = parseFirstForm(login.text, login.url)
  if (!entry) throw new Error(`ROLECE: no Cl@ve entry form at ${login.url}`)
  const pasarela = await postForm(client, entry, {}, { referer: login.url })
  const chooser = selectIdpChooserForm(pasarela.text, pasarela.url)
  const relay = chooser
    ? await postForm(
        client,
        chooser,
        { SelectedIdP: roleceUrls.certificateIdp },
        { referer: pasarela.url, headers: { Origin: roleceUrls.claveOrigin } },
      )
    : pasarela
  await walkSamlChain(client, relay)
  const home = await client.request(roleceUrls.home)
  if (!home.text.includes('logout.action'))
    throw new Error(
      `ROLECE: the Cl@ve login did not open a session (landed on ${home.url})`,
    )
}
