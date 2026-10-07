import type { HttpClient } from '../../../http/types/HttpClient'
import { apiHeaders } from '../../api/apiHeaders'
import { dehuUrls } from '../../api/dehuUrls'
import { parseJsonResponse } from '../../api/parseJsonResponse'
import { parseRealizedNotificationPage } from '../parsers/parseRealizedNotificationPage'
import { realizedMonthWindow } from '../realizedMonthWindow'
import type { Notification } from '../types/Notification'
import type { NotificationSweep } from '../types/NotificationSweep'

/**
 * Read every realized notification of one calendar year. DEHU rejects any
 * date window wider than a month, so the year is swept one month at a time,
 * each paged until a short page ends it.
 */
export const fetchRealizedNotifications = async (
  client: HttpClient,
  authData: string,
  year: number,
): Promise<NotificationSweep> => {
  const pageSize = 100
  const notifications: Notification[] = []
  let pages = 0
  for (let month = 1; month <= 12; month += 1) {
    const window = realizedMonthWindow(year, month)
    for (let page = 1; ; page += 1) {
      const params = new URLSearchParams({
        'finalDate[left_date]': window.from,
        'finalDate[right_date]': window.to,
        page: String(page),
        limit: String(pageSize),
      })
      const response = await client.request(
        `${dehuUrls.realized}?${params.toString()}`,
        { headers: apiHeaders(authData), referer: dehuUrls.notificationsPage },
      )
      const parsed = parseRealizedNotificationPage(
        parseJsonResponse(response, `realized notifications ${window.from}`),
      )
      pages += 1
      notifications.push(...parsed)
      if (parsed.length < pageSize) break
    }
  }
  return { notifications, pages }
}
