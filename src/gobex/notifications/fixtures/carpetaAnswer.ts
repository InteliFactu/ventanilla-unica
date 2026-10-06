import type { HttpResponse } from '../../../http/types/HttpResponse'

/** A canned sede answer at `Notificaciones.jsf` unless another path is given. */
export const carpetaAnswer = (
  content: string | Buffer,
  path = 'Notificaciones.jsf',
): HttpResponse => {
  const body = Buffer.isBuffer(content) ? content : Buffer.from(content)
  return {
    status: 200,
    url: `https://sede.gobex.es/SEDE/privado/ciudadanos/${path}`,
    headers: {},
    body,
    text: body.toString(),
  }
}
