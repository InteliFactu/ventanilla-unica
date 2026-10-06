import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { gobexTimeoutMs } from '../../session/gobexTimeoutMs'
import type { LocatedCarpetaNotification } from '../types/LocatedCarpetaNotification'

/**
 * Click a notification's action link: post the list form with the link's
 * parameter. A pending notification answers `firmarAcuseRecibo.jsf` (the
 * acceptance screen; nothing is accepted yet), an accepted one answers the
 * list again with the `panelDescargar` modal.
 */
export const openCarpetaNotification = async (
  client: HttpClient,
  located: LocatedCarpetaNotification,
): Promise<HttpResponse> =>
  client.request(located.form.action, {
    timeoutMs: gobexTimeoutMs,
    method: 'POST',
    form: { ...located.form.fields, [located.link]: located.link },
    referer: located.referer,
  })
