import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { respondWith } from '../../sta/registry/fixtures/respondWith'
import { dgsfpUrls } from '../session/dgsfpUrls'
import { dgsfpDigestPage } from './dgsfpDigestPage'
import { respondJson } from './respondJson'

/** The sede and Cl@ve pages a fake client answers through login, for an invented holder 00000000T. */
export const dgsfpLoginRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [
  [
    (url) => url.includes('/Paginas/Procedimiento.aspx'),
    (url) => respondWith(url, dgsfpDigestPage),
  ],
  [
    (url) => url.includes('createClave2Request'),
    (url) =>
      respondJson(url, {
        action: 'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
        method: 'POST',
        samlRequest: 'r',
        relayState: 's',
      }),
  ],
  [
    (url) => url.endsWith('/Proxy2/ServiceProvider'),
    (url) =>
      respondWith(
        url,
        '<form name="idpRedirect" action="https://pasarela.clave.gob.es/Proxy2/ServiceRedirect"><input type="hidden" name="SelectedIdP" value=""></form>',
      ),
  ],
  [
    (url) => url.endsWith('/Proxy2/ServiceRedirect'),
    (url) =>
      respondWith(
        url,
        '<form action="https://www.sededgsfp.gob.es/ES/Paginas/ResponseLoginClave.aspx"><input type="hidden" name="SAMLResponse" value="x"></form>',
      ),
  ],
  [
    (url) => url.includes('ResponseLoginClave'),
    () => respondWith(dgsfpUrls.formPage, dgsfpDigestPage),
  ],
  [
    (url) => url.endsWith('getCurrentUser'),
    (url) =>
      respondJson(url, {
        identificador: '00000000T',
        nombre: 'ANA',
        apellido1: 'PEREZ',
        apellido2: 'GIL',
        enRepresentacionDe: '',
      }),
  ],
]
