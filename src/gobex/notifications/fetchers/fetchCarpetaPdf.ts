import type { HttpClient } from '../../../http/types/HttpClient'
import type { HttpResponse } from '../../../http/types/HttpResponse'
import { gobexTimeoutMs } from '../../session/gobexTimeoutMs'
import { selectFormWithInput } from '../selectors/selectFormWithInput'
import { selectInputEndingWith } from '../selectors/selectInputEndingWith'
import { isPdf } from '../validators/isPdf'

/**
 * Press one image button of the `panelDescargar` modal (`imprimirnot` for the
 * notification, `imprimiracuse` for the acuse) and return the PDF it answers
 * (`application/xop+xml`, attachment). Undefined when the page has no such
 * button or the answer is not a PDF: on 2026-10-06 `imprimiracuse` answered
 * the HTML page instead.
 */
export const fetchCarpetaPdf = async (
  client: HttpClient,
  page: HttpResponse,
  button: string,
): Promise<Buffer | undefined> => {
  const name = selectInputEndingWith(page.text, button)
  const form = name ? selectFormWithInput(page.text, page.url, name) : undefined
  if (!name || !form) return undefined
  const answer = await client.request(form.action, {
    timeoutMs: gobexTimeoutMs,
    method: 'POST',
    form: { ...form.fields, [`${name}.x`]: '10', [`${name}.y`]: '10' },
    referer: page.url,
  })
  return isPdf(answer.body) ? answer.body : undefined
}
