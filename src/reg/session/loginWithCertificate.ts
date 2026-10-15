import { selectIdpChooserForm } from '../../dehu/session/selectors/selectIdpChooserForm'
import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import { walkSamlChain } from '../../sepe/session/walkSamlChain'
import { callRegApi } from './fetchers/callRegApi'
import { readLoginTokens } from './parsers/readLoginTokens'
import { regUrls } from './regUrls'
import type { RegTokens } from './types/RegTokens'
import type { SamlRequestAnswer } from './types/SamlRequestAnswer'

/**
 * Log the holder in as the front's "Acceder" does: `auth/saml/clave2` answers
 * `{saml}`, posted to Cl@ve with `forcedIdP=none` and `allowLegalPerson=1`;
 * the chooser is answered with the certificate IdP and the relay lands on
 * `/es/logincheck?token=&refreshToken=`, a bearer pair (no cookie session).
 */
export const loginWithCertificate = async (
  client: HttpClient,
): Promise<RegTokens> => {
  const request = (await callRegApi(
    client,
    undefined,
    `auth/saml/clave2?environment=${regUrls.front}&selectedLanguage=es`,
  )) as SamlRequestAnswer
  const chooserPage = await client.request(regUrls.clave, {
    method: 'POST',
    form: {
      SAMLRequest: request.saml,
      forcedIdP: 'none',
      excludedIdPList: '',
      allowLegalPerson: '1',
    },
    referer: `${regUrls.origin}/`,
    headers: { Origin: regUrls.origin },
  })
  const chooser = selectIdpChooserForm(chooserPage.text, chooserPage.url)
  if (!chooser)
    throw new Error(`REG: no Cl@ve IdP chooser at ${chooserPage.url}`)
  const relay = await postForm(
    client,
    chooser,
    { SelectedIdP: regUrls.certificateIdp },
    { referer: chooserPage.url, headers: { Origin: regUrls.claveOrigin } },
  )
  const landing = await walkSamlChain(client, relay)
  const tokens = readLoginTokens(landing.url)
  if (tokens === undefined)
    throw new Error(
      `REG: the Cl@ve login failed (landed on ${landing.url.split('?')[0] ?? ''})`,
    )
  return tokens
}
