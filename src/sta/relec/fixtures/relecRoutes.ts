import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { buildClassicPdf } from '../../../signing/pades/fixtures/buildClassicPdf'
import { respondWith } from '../../registry/fixtures/respondWith'
import { relecFormHtml } from './relecFormHtml'
import { relecFormXml } from './relecFormXml'
import { relecResultHtml } from './relecResultHtml'
import { relecSignPageHtml } from './relecSignPageHtml'
import { relecTypesText } from './relecTypesText'

/** Every Relec call of `caceres aportar`, each a URL test and the answer the sede gave on 2026-10-09 (synthetic values). */
export const relecRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [
  [
    (url) => url.includes('/CarpetaPrivate/Certificate'),
    (url) => respondWith(url, '<a href="/sta/CarpetaPrivate/Logout">Salir</a>'),
  ],
  [
    (url) => url.endsWith('/sta/frame.jsp'),
    (url) => respondWith(url, '<frameset></frameset>'),
  ],
  [
    (url) => url.includes('/Relec/TramitaForm'),
    () =>
      respondWith(
        `https://sede.caceres.es/sta/Relec/TramitaForm?dboidSolicitud=6269000000002829307935&frame=true`,
        relecFormHtml,
      ),
  ],
  [
    (url) => url.includes('/ApordocAjaxLoader?getTypes=0'),
    (url) => respondWith(url, relecTypesText),
  ],
  [
    (url) => url.includes('/documentSignSend.jsp'),
    (url) =>
      respondWith(
        url,
        '<input type="hidden" id="sessionid" value="ABCDEF0123"/>',
      ),
  ],
  [
    (url) => url.includes('/FileUploader?'),
    (url) =>
      respondWith(
        url,
        '<html><body><script>parent.uploadEnd();</script></body></html>',
      ),
  ],
  [
    (url) => url.includes('/AutofirmaDownload10?'),
    (url) => respondWith(url, buildClassicPdf().toString('base64')),
  ],
  [(url) => url.includes('/AutofirmaUpload10?'), (url) => respondWith(url, '')],
  [
    (url) => url.endsWith('/Relec/TramitaSign'),
    () =>
      respondWith(
        `https://sede.caceres.es/sta/Relec/TramitaSign`,
        relecSignPageHtml,
      ),
  ],
  [
    (url) => url.endsWith('/FileUploaderApplet'),
    (url, options) =>
      respondWith(
        url,
        options?.headers?.['callOpAction'] === 'bajarArchivo'
          ? Buffer.from(relecFormXml).toString('base64')
          : '',
      ),
  ],
  [
    (url) => url.endsWith('/Relec/TramitaJustif'),
    () =>
      respondWith(
        `https://sede.caceres.es/sta/Relec/TramitaJustif`,
        relecResultHtml,
      ),
  ],
  [
    (url) => url.includes('/Utils/DocumentCheck'),
    (url) => respondWith(url, Buffer.from('%PDF-1.4 justificante')),
  ],
]
