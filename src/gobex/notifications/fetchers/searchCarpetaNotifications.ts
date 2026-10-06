import type { HttpClient } from '../../../http/types/HttpClient'
import { submitGobexSearch } from '../../fetchers/submitGobexSearch'
import { parseGrids } from '../../parsers/parseGrids'
import { selectDatascroller } from '../../selectors/selectDatascroller'
import { gobexUrls } from '../../session/gobexUrls'
import { selectFormWithInput } from '../selectors/selectFormWithInput'
import type { CarpetaNotificationGrid } from '../types/CarpetaNotificationGrid'

/** Search the notifications in every state and read the first page's grid, list form and scroller. */
export const searchCarpetaNotifications = async (
  client: HttpClient,
): Promise<CarpetaNotificationGrid> => {
  const { results, formId } = await submitGobexSearch(
    client,
    gobexUrls.notifications,
    (form) => ({ [`${form}:estado`]: '' }),
  )
  const grid = parseGrids(results.text).find((candidate) =>
    candidate.id.startsWith(`${formId}:`),
  )
  const form = selectFormWithInput(results.text, results.url, formId)
  if (!grid || !form)
    throw new Error('Junta: the notification search answered no result grid')
  return {
    results,
    grid,
    form,
    scroller: selectDatascroller(results.text, formId),
  }
}
