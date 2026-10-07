import type { HttpClient } from '../../../http/types/HttpClient'
import { apiHeaders } from '../../api/apiHeaders'
import { dehuUrls } from '../../api/dehuUrls'

/**
 * THE LEGAL ACT. POST `{"operation":"aceptar"}` to the notification's
 * `voucher` resource with the bearer the re-authentication handed back (the
 * listing session's own bearer is refused). A 200 answers with the
 * notification document; from then on it is notified. Returns the status.
 */
export const postNotificationAcceptance = async (
  client: HttpClient,
  appearanceAuthData: string,
  reference: string,
): Promise<number> => {
  const response = await client.request(
    `${dehuUrls.pending}/${encodeURIComponent(reference)}/voucher`,
    {
      method: 'POST',
      body: JSON.stringify({ operation: 'aceptar' }),
      headers: {
        ...apiHeaders(appearanceAuthData),
        'Content-Type': 'application/json',
        Origin: dehuUrls.base,
      },
      referer: `${dehuUrls.base}/es/notificaciones-pendientes/aceptar/${reference}/login`,
    },
  )
  return response.status
}
