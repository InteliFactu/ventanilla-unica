import { apiHeaders } from '../../api/apiHeaders'
import { asRecord } from '../../api/asRecord'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'
import type { FileDownloadRequest } from '../types/FileDownloadRequest'
import type { NotificationFileResponse } from '../types/NotificationFileResponse'

/**
 * One GET of a realized notification's document or voucher. Only the
 * `realized_notifications` resource is ever read: a pending notification's
 * document is behind the comparecencia, which only `dehu comparecer` performs.
 */
export const fetchNotificationFile = async ({
  client,
  authData,
  reference,
  kind,
}: FileDownloadRequest): Promise<NotificationFileResponse> => {
  const ok = 200
  const response = await client.request(
    `${dehuUrls.realized}/${encodeURIComponent(reference)}/${kind}`,
    { headers: apiHeaders(authData), referer: dehuUrls.notificationsPage },
  )
  if (response.status !== ok) return { status: response.status }
  const body = asRecord(parseJsonResponse(response, `${kind} of ${reference}`))
  const content = body?.['content']
  const name = body?.['name']
  return {
    status: response.status,
    content: typeof content === 'string' ? content : undefined,
    name: typeof name === 'string' ? name : undefined,
  }
}
