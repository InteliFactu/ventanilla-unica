import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { registryRoutes } from './registryRoutes'
import { registrySubmitAnswer } from './registrySubmitAnswer'
import { representativePersonFixture } from './representativePersonFixture'
import { respondWith } from './respondWith'

/**
 * The calls of the "Aporte documentación" procedure as the Junta answered
 * them on 2026-10-09 to a representative certificate: no documents section,
 * an `apordocType`, and one open expediente of the represented entity. The
 * login, upload, signing and receipt answers are the general registry's.
 */
export const contributionRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [
  [
    (url) => url.includes('/sta/reg/auth/'),
    () =>
      respondWith(
        'https://tramites.juntaex.es/sta/reg/tramite/6269000000810119707984/11111111-2222-4333-8444-555555555555/credentials',
        '',
      ),
  ],
  [
    (url) => url.includes('/people/me/'),
    (url) =>
      respondWith(url, JSON.stringify({ person: representativePersonFixture })),
  ],
  [
    (url) => url.endsWith('/11111111-2222-4333-8444-555555555555'),
    (url) =>
      respondWith(
        url,
        JSON.stringify({
          sections: { data: { elements: [] }, documents: null },
          apordocType: { id: 'T1' },
        }),
      ),
  ],
  [
    (url) => url.endsWith('/people/info/expedientes'),
    (url) =>
      respondWith(
        url,
        JSON.stringify([
          { dboid: 'X1', numExp: '2026/25777D', procedure: 'Ayuda IA' },
        ]),
      ),
  ],
  [
    (url) => url.endsWith('/requests/6269000000810119707984'),
    (url, options) => respondWith(url, registrySubmitAnswer(options)),
  ],
  ...registryRoutes,
]
