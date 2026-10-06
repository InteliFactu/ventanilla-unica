import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { CarpetaNotificationRow } from '../types/CarpetaNotificationRow'
import type { LocatedCarpetaNotification } from '../types/LocatedCarpetaNotification'

/**
 * The row numbered `id` among one grid page's rows, ready to click: the list
 * form, with `viewState` in place of its own when the row came from a
 * scroller fragment (which carries the state of the page it shows).
 * Undefined when the page does not hold the row.
 */
export const locateNotificationRow = (
  rows: readonly CarpetaNotificationRow[],
  id: string,
  form: HtmlForm,
  viewState: string | undefined,
): Omit<LocatedCarpetaNotification, 'referer'> | undefined => {
  const row = rows.find((candidate) => candidate.record['notification'] === id)
  if (!row) return undefined
  if (!row.link)
    throw new Error(`Junta: notification ${id} has no link to open it`)
  const fields = viewState
    ? { ...form.fields, 'javax.faces.ViewState': viewState }
    : form.fields
  return {
    record: row.record,
    link: row.link,
    form: { action: form.action, fields },
  }
}
