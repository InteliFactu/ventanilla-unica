import type { HtmlForm } from '../../html/types/HtmlForm'
import type { HttpResponse } from '../../http/types/HttpResponse'
import { selectFormByName } from '../../sepe/certificates/selectors/selectFormByName'

/** The `inscripcionPersonaF` form every application screen posts, or an error naming the page. */
export const readApplicationForm = (page: HttpResponse): HtmlForm => {
  const form = selectFormByName(page.text, 'inscripcionPersonaF', page.url)
  if (!form)
    throw new Error(
      `ROLECE: no application form at ${page.url} (${String(page.status)})`,
    )
  return form
}
