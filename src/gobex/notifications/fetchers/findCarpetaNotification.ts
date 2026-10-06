import type { HttpClient } from '../../../http/types/HttpClient'
import { fetchScrollerPage } from '../../fetchers/fetchScrollerPage'
import { locateNotificationRow } from '../mappers/locateNotificationRow'
import { parseNotificationRows } from '../parsers/parseNotificationRows'
import { readViewState } from '../parsers/readViewState'
import type { LocatedCarpetaNotification } from '../types/LocatedCarpetaNotification'
import { searchCarpetaNotifications } from './searchCarpetaNotifications'

/**
 * Search every notification (any state) and walk the grid's scroller pages
 * until the row numbered `id` turns up. A page past the end answers the
 * first page again, so the walk stops on a page with nothing new, and never
 * goes past 50 pages.
 */
export const findCarpetaNotification = async (
  client: HttpClient,
  id: string,
): Promise<LocatedCarpetaNotification> => {
  const { results, grid, form, scroller } =
    await searchCarpetaNotifications(client)
  const seen = new Set<string>()
  let page = results
  for (let next = 2; next <= 51; next += 1) {
    const rows = parseNotificationRows(page.text, grid)
    const viewState = page === results ? undefined : readViewState(page.text)
    const located = locateNotificationRow(rows, id, form, viewState)
    if (located) return { ...located, referer: results.url }
    const fresh = rows
      .map((row) => row.record['notification'] ?? '')
      .filter((number) => !seen.has(number))
    if (!scroller || fresh.length === 0 || next > 50) break
    for (const number of fresh) seen.add(number)
    page = await fetchScrollerPage(client, results, scroller, next)
  }
  throw new Error(
    `Junta: notification ${id} is not in the Carpeta Ciudadana (junta carpeta-notificaciones lists them)`,
  )
}
