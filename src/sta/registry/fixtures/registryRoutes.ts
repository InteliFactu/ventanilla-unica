import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { registryPersonFixture } from './registryPersonFixture'
import { registrySchemaFixture } from './registrySchemaFixture'
import { registrySubmitAnswer } from './registrySubmitAnswer'
import { respondWith } from './respondWith'

/** The registry calls a fake client answers, each a URL test and its canned answer; the draft is `1111…5555`. */
export const registryRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [
  [
    (url) => url.includes('/CarpetaPrivate/Certificate'),
    (url) => respondWith(url, '<a href="/sta/CarpetaPrivate/Logout">Salir</a>'),
  ],
  [
    (url) => url.includes('/sta/reg/auth/'),
    () =>
      respondWith(
        'https://tramites.juntaex.es/sta/reg/tramite/6269000000814004007984/11111111-2222-4333-8444-555555555555/credentials',
        '',
      ),
  ],
  [
    (url) => url.includes('/people/me/'),
    (url) =>
      respondWith(url, JSON.stringify({ person: registryPersonFixture })),
  ],
  [
    (url) => url.endsWith('/11111111-2222-4333-8444-555555555555'),
    (url) => respondWith(url, JSON.stringify(registrySchemaFixture)),
  ],
  [
    (url) => url.includes('/files'),
    (url) =>
      respondWith(
        url,
        JSON.stringify({
          id: 'D1',
          hash: 'h',
          size: 9,
          name: 'a.pdf',
          mimeType: 'application/pdf',
        }),
      ),
  ],
  [
    (url) => url.includes('AutofirmaDownload'),
    (url) =>
      respondWith(
        url,
        Buffer.from('<?xml version="1.0"?><REGIS><A>1</A></REGIS>').toString(
          'base64',
        ),
      ),
  ],
  [(url) => url.includes('AutofirmaUpload'), (url) => respondWith(url, '')],
  [
    (url) => url.includes('DocumentCheck'),
    (url) => respondWith(url, Buffer.from('%PDF-1.4 receipt')),
  ],
  [
    (url) => url.endsWith('/requests/6269000000814004007984'),
    (url, options) => respondWith(url, registrySubmitAnswer(options)),
  ],
]
