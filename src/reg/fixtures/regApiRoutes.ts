import { respondJson } from '../../dgsfp/fixtures/respondJson'
import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { fakeXmlSummary } from './fakeXmlSummary'

/** The REG API's catalogue, filing and registry answers, shaped as the live ones on 2026-10-15. */
export const regApiRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [
  [
    (url) => url.includes('dir3/search'),
    (url) =>
      respondJson(url, {
        items: [
          { cdUtOrganic: 'L01100000', dsUtOrganic: 'Ayuntamiento de Prueba' },
        ],
        totalElements: 1,
      }),
  ],
  [
    (url) => url.endsWith('dir3/typeVia'),
    (url) => respondJson(url, [{ cdTipoVia: '2', dsTipoVia: 'Calle' }]),
  ],
  [
    (url) => url.endsWith('dir3/province'),
    (url) => respondJson(url, [{ cdProvincia: '10', dsProvincia: 'Cáceres' }]),
  ],
  [
    (url) => url.endsWith('dir3/province/10/location'),
    (url) => respondJson(url, [{ cdLocalidad: '0001', dsLocalidad: 'Prueba' }]),
  ],
  [
    (url) => url.endsWith('/documents/'),
    (url) =>
      respondJson(url, {
        uuid: 'd1',
        name: 'escrito.pdf',
        contentType: 'application/pdf',
        size: 9,
        mimeType: 'application/pdf',
        voucher: false,
        description: '',
      }),
  ],
  [
    (url) => url.endsWith('registry/?certificate=true'),
    (url) => respondJson(url, { uuid: 'u1', xmlSummary: fakeXmlSummary }),
  ],
  [
    (url) => url.includes('registry/signCertificate/'),
    (url) => respondJson(url, { uuid: 'u1', sign: true }),
  ],
  [
    (url) => url.endsWith('registry/searchRegistry'),
    (url) =>
      respondJson(url, {
        numberOfElements: 1,
        totalPage: 1,
        items: [{ registryNumber: 'R1', uuid: 'u1', status: 'Recibido' }],
      }),
  ],
  [
    (url) => url.endsWith('registry/u1'),
    (url) =>
      respondJson(url, {
        registryData: {
          registryNumber: 'R1',
          cdStatus: 'EN',
          status: 'Enviado',
        },
        document: [
          { uuid: 'v1', name: '../JustificanteFirmado.pdf', voucher: true },
        ],
      }),
  ],
  [
    (url) => url.includes('trace/R1/'),
    (url) =>
      respondJson(url, { annotations: [{ dsState: 'REGISTRO ENVIADO' }] }),
  ],
  [
    (url) => url.includes('documents/uuid/v1/'),
    (url) =>
      respondJson(url, {
        name: 'JustificanteFirmado.pdf',
        file: Buffer.from('%PDF-1.4 receipt').toString('base64'),
      }),
  ],
]
