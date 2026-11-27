import { htmlToText } from '../../html/htmlToText'
import type { HttpClient } from '../../http/types/HttpClient'
import { fetchNotificationList } from './fetchers/fetchNotificationList'
import { filterForYear } from './mappers/filterForYear'
import { parseNotificationRows } from './parsers/parseNotificationRows'
import type { AeatNotification } from './types/AeatNotification'

/** The unread notifications of the last twelve months: a read, nothing is opened. */
export const listPendingNotifications = async (
  client: HttpClient,
  today: Date,
): Promise<readonly AeatNotification[]> => {
  const html = await fetchNotificationList(
    client,
    filterForYear('unread', today),
  )
  const rows = parseNotificationRows(html)
  if (
    rows.length === 0 &&
    !htmlToText(html).includes('No se han obtenido resultados')
  ) {
    throw new Error('AEAT: unrecognized notification list response')
  }
  return rows.filter((row) => !row.leida)
}
