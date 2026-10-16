import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { registradoresSamlForm } from './registradoresSamlForm'

/** Synthetic pages of the two SAML logins, in request order; the last is the mercantil search. */
export const registradoresLoginPages = (): HttpResponse[] => {
  const site = 'https://sede.registradores.org/site/'
  const auth = 'https://api-sede-pub-auth.registradores.org/sede-corpme-core/'
  const idp =
    'https://sso.registradores.org/saml/idp/profile/redirectorpost/sso'
  const samlForm = registradoresSamlForm
  return [
    htmlResponse(`${auth}saml2/authenticate/f5`, samlForm(idp, 'SAMLRequest')),
    htmlResponse(idp, samlForm(`${auth}login/saml2/sso/f5`, 'SAMLResponse')),
    htmlResponse(
      'https://sede.registradores.org/sede/sede-corpme-web/select-represented/',
      '<p>home</p>',
    ),
    htmlResponse(
      `${site}sede/secure/mercantil/nota`,
      samlForm(idp, 'SAMLRequest'),
    ),
    htmlResponse(idp, samlForm(`${site}acs`, 'SAMLResponse')),
    htmlResponse(
      `${site}certificado/mercantil/busqueda`,
      '<form method="post" action="/site/certificado/mercantil/busqueda/sociedad"><input type="hidden" name="_csrf" value="csrf-1"/></form>',
    ),
  ]
}
