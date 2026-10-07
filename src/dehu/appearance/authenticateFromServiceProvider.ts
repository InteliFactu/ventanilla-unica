import { postForm } from '../../http/postForm'
import type { HttpClient } from '../../http/types/HttpClient'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { selectIdpAndAuthenticate } from '../session/selectors/selectIdpAndAuthenticate'
import { selectIdpChooserForm } from '../session/selectors/selectIdpChooserForm'
import { selectSamlRelayForm } from '../session/selectors/selectSamlRelayForm'

/**
 * Get from Cl@ve's ServiceProvider answer to the certificate authentication.
 * A first visit shows the identity-provider chooser; within the same Cl@ve
 * session the re-authentication skips it and auto-submits straight to
 * AuthenticateCitizen, so both shapes are handled.
 */
export const authenticateFromServiceProvider = async (
  client: HttpClient,
  servicePage: HttpResponse,
): Promise<HttpResponse> => {
  if (selectIdpChooserForm(servicePage.text, servicePage.url))
    return selectIdpAndAuthenticate(client, servicePage)
  const authenticateForm = selectSamlRelayForm(
    servicePage.text,
    servicePage.url,
  )
  if (!authenticateForm)
    throw new Error('DEHU: no Cl@ve form after the appearance ServiceProvider')
  return postForm(client, authenticateForm, {}, { referer: servicePage.url })
}
