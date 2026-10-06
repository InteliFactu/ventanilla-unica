import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import type { Datascroller } from '../../types/Datascroller'
import type { GobexGrid } from '../../types/GobexGrid'

/** The first page of an every-state notification search: the page, its grid, the list form and the scroller when there are more pages. */
export type CarpetaNotificationGrid = {
  readonly results: HttpResponse
  readonly grid: GobexGrid
  readonly form: HtmlForm
  readonly scroller: Datascroller | undefined
}
