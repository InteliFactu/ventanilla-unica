import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../http/types/HttpResponse'

/**
 * The three answers of a DGT certificate login, synthetic: the protected page
 * with its Cl@ve SAML form, the IdP chooser, and the page the relay lands on.
 */
export const dgtLoginResponses = (): HttpResponse[] => [
  {
    ...htmlResponse(
      'https://sede.dgt.gob.es/es/mi_dgt/mis-suscripciones/',
      '<form method="post" action="https://pasarela.clave.gob.es/Proxy2/ServiceProvider"><input type="hidden" name="SAMLRequest" value="UkVR"/><input type="hidden" name="RelayState" value="r1"/></form>',
    ),
    status: 401,
  },
  htmlResponse(
    'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
    '<form name="idpLanguage" action="ServiceLanguage"><input type="hidden" name="SAMLRequest" value="UkVR"/></form><form name="idpRedirect" action="ServiceRedirect" method="post"><input type="hidden" name="SAMLRequest" value="UkVR"/><input type="hidden" name="RelayState" value="r1"/><input type="hidden" name="SelectedIdP" value=""/></form>',
  ),
  htmlResponse(
    'https://sede.dgt.gob.es/es/mi_dgt/mis-suscripciones/',
    '<h1>Mis datos de contacto y suscripciones</h1>',
  ),
]
