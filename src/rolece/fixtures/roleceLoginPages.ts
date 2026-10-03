import { htmlResponse } from '../../http/fixtures/htmlResponse'
import type { HttpResponse } from '../../http/types/HttpResponse'

/** The synthetic pages of a ROLECE Cl@ve login, in the order the client requests them. */
export const roleceLoginPages = (): HttpResponse[] => [
  htmlResponse(
    'https://registrodelicitadores.gob.es/rolece/public/login.action',
    '<form id="redirectForm" method="post" action="https://pasarela.clave.gob.es/Proxy2/ServiceProvider"><input type="hidden" name="RelayState" value="r"/><input type="hidden" name="SAMLRequest" value="q"/></form>',
  ),
  htmlResponse(
    'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
    '<form name="redirectForm" method="post" action="https://pasarela-ident.clave.gob.es/IdP2/AuthenticateCitizen"><input type="hidden" name="SAMLRequest" value="q"/></form>',
  ),
  htmlResponse(
    'https://registrodelicitadores.gob.es/rolece/public/ReturnAction',
    '<meta http-equiv="Refresh" content="0;URL=/rolece/public/iniciologin.action">',
  ),
  htmlResponse(
    'https://registrodelicitadores.gob.es/rolece/public/iniciologin.action',
    '<a href="https://registrodelicitadores.gob.es:443/rolece/public/logout.action">Finalizar Sesión</a>',
  ),
]
