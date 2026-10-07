import type { HttpClient } from '../../../http/types/HttpClient'
import { apiHeaders } from '../../api/apiHeaders'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'
import { parsePendingNotificationPage } from '../parsers/parsePendingNotificationPage'
import type { Notification } from '../types/Notification'
import type { NotificationSweep } from '../types/NotificationSweep'

/** Read every pending notification, paging while DEHU keeps answering a full page. */
export const fetchPendingNotifications = async (
  client: HttpClient,
  authData: string,
): Promise<NotificationSweep> => {
  const pageSize = 50
  const notifications: Notification[] = []
  let pages = 0
  for (let page = 1; ; page += 1) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    })
    const response = await client.request(
      `${dehuUrls.pending}?${params.toString()}`,
      { headers: apiHeaders(authData), referer: dehuUrls.notificationsPage },
    )
    const parsed = parsePendingNotificationPage(
      parseJsonResponse(response, 'pending notifications'),
    )
    pages += 1
    notifications.push(...parsed)
    if (parsed.length < pageSize) break
  }
  return { notifications, pages }
}
