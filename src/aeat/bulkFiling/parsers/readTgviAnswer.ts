import type { TgviAnswer } from '../types/TgviAnswer'
import { headerValue } from './headerValue'
import { optionalNumber } from './optionalNumber'

/** TGVI answers in headers: codigo, mensaje, idenvio, sigbloque, totalt2ok/ko, avisos, csv. */
export const readTgviAnswer = (
  headers: Readonly<Record<string, string | string[] | undefined>>,
): TgviAnswer => ({
  codigo: Number(headerValue(headers, 'codigo') ?? 'NaN'),
  mensaje: headerValue(headers, 'mensaje') ?? '',
  idEnvio: headerValue(headers, 'idenvio'),
  siguienteBloque: optionalNumber(headerValue(headers, 'sigbloque')),
  correctos: optionalNumber(headerValue(headers, 'totalt2ok')),
  erroneos: optionalNumber(headerValue(headers, 'totalt2ko')),
  avisos: headerValue(headers, 'avisos') === 'S',
  csv: headerValue(headers, 'csv'),
})
