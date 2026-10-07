import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { dehuUrls } from '../api/dehuUrls'
import { completeSamlResponseRelay } from './completeSamlResponseRelay'
import { fetchClaveLoginForm } from './fetchClaveLoginForm'
import { readAuthData } from './readAuthData'
import { selectIdpAndAuthenticate } from './selectors/selectIdpAndAuthenticate'

/**
 * Complete DEHU's six-hop Cl@ve relay with the client's own certificate and
 * return the bearer JWT it hands back as `authData`. The comparecencia needs
 * a second relay of its own (`reauthenticateForAppearance`).
 */
export const loginWithCertificate = async (
  client: HttpClient,
): Promise<string> => {
  const claveForm = await fetchClaveLoginForm(client)
  const chooserPage = await postForm(
    client,
    claveForm,
    {},
    {
      referer: dehuUrls.base,
    },
  )
  const identityPage = await selectIdpAndAuthenticate(client, chooserPage)
  const loginCheckPage = await completeSamlResponseRelay(client, identityPage)
  const location = loginCheckPage.headers['location']
  const authData = readAuthData(
    typeof location === 'string' ? location : loginCheckPage.url,
    loginCheckPage.url,
  )
  if (!authData)
    throw new Error('DEHU: no authData in the login-check response')
  return authData
}
