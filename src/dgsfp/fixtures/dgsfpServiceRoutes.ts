import { createHash } from 'node:crypto'

import type { HttpRequestOptions } from '../../http/types/HttpRequestOptions'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { dgsfpUrls } from '../session/dgsfpUrls'
import { dgsfpHolderSection } from './dgsfpHolderSection'
import { dgsfpSectionsFixture } from './dgsfpSectionsFixture'
import { fakePdfBase64 } from './fakePdfBase64'
import { respondJson } from './respondJson'

/** The sede services a fake client answers after login: form, places, checks, upload, draft and registry. */
export const dgsfpServiceRoutes: readonly [
  (url: string) => boolean,
  (url: string, options?: HttpRequestOptions) => HttpResponse,
][] = [
  [
    (url) => url.includes('obtenerFormularioProcedimiento'),
    (url) =>
      respondJson(url, {
        jsonFormulario: JSON.stringify({ secciones: dgsfpSectionsFixture }),
        numTelematico: 'TEL43',
        tituloProcedimiento: 'Presentación de quejas y reclamaciones',
      }),
  ],
  [
    (url) => url.includes('ObtenerSeccion?ns=41'),
    (url) => respondJson(url, dgsfpHolderSection),
  ],
  [
    (url) => url.includes('nt=Provincias'),
    (url) => respondJson(url, [{ Key: '10', Value: 'Cáceres' }]),
  ],
  [
    (url) => url.includes('ObtenerMunicipios?codProvincia=10'),
    (url) =>
      respondJson(url, { municipios: [{ Key: '377', Value: 'Cáceres' }] }),
  ],
  [
    (url) => url.endsWith('validarCodigoPostal'),
    (url) =>
      respondJson(url, { advertencias: null, errores: null, resultado: true }),
  ],
  [
    (url) => url.includes('getParametroValue'),
    (url) => respondJson(url, 'TEXTO'),
  ],
  [(url) => url.endsWith('generarHMAC'), (url) => respondJson(url, 'abc123')],
  [
    (url) => url === dgsfpUrls.upload,
    (url, options) => {
      const body = Buffer.from(options?.body ?? '')
      const start = body.indexOf('\r\n\r\n') + 4
      const end = body.lastIndexOf('\r\n--')
      const hash = createHash('sha256')
        .update(body.subarray(start, end))
        .digest('hex')
      return respondJson(url, `TEL43;#field_name.pdf;#${hash}`)
    },
  ],
  [
    (url) => url.endsWith('comprobarAdjuntoPresentacion'),
    (url) => respondJson(url, true),
  ],
  [
    (url) => url.endsWith('guardarBorradorPresentacion'),
    (url) => respondJson(url, 7),
  ],
  [
    (url) => url.endsWith('registrarPresentacionTelematica'),
    (url) =>
      respondJson(url, {
        numRegistro: 'REG/0001',
        fechaRegistro: '05/10/2026 17:00:00',
        csv: 'CSV1',
        justificanteRegistroB64: fakePdfBase64('justificante'),
        nombreJustificante: '../Justificante.pdf',
        documentoSolicitudB64: fakePdfBase64('solicitud'),
      }),
  ],
]
