import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { GobexRecord } from '../../types/GobexRecord'

/**
 * A notification found in the grid, with what clicking its link needs: the
 * link parameter and the list form as it stood on the page that showed the
 * row (its ViewState carries the scroller page).
 */
export type LocatedCarpetaNotification = {
  readonly record: GobexRecord
  readonly link: string
  readonly form: HtmlForm
  readonly referer: string
}
