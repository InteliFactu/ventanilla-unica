import { respondJson } from '../../dgsfp/fixtures/respondJson'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { respondWith } from '../../sta/registry/fixtures/respondWith'

/** Cl@ve and the login API calls for an invented holder 00000000T, shaped as the live ones on 2026-10-15. */
export const regLoginRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [
  [
    (url) => url.includes('auth/saml/clave2'),
    (url) => respondJson(url, { saml: 's' }),
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
        '<form action="https://reg-api.redsara.es/auth/saml/response"><input type="hidden" name="SAMLResponse" value="x"></form>',
      ),
  ],
  [
    (url) => url.endsWith('auth/saml/response'),
    () =>
      respondWith(
        'https://reg.redsara.es/es/logincheck?token=t1&refreshToken=r1',
        '<app-root></app-root>',
      ),
  ],
  [
    (url) => url.endsWith('auth/user'),
    (url) =>
      respondJson(url, {
        docType: 'N',
        docNumber: '00000000T',
        nameUser: 'ANA',
        firstSurname: 'PEREZ',
        familyNameUser: 'PEREZ GIL',
        businessName: '',
        jwt: 'secret',
      }),
  ],
]
