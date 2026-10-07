import type { HttpClient } from '../../http/types/HttpClient'
import { selectImageButtonForm } from '../selectors/selectImageButtonForm'
import { gobexTimeoutMs } from '../session/gobexTimeoutMs'
import type { GobexSearchSubmission } from '../types/GobexSearchSubmission'
import { submitImageButton } from './submitImageButton'

/**
 * Open a Carpeta Ciudadana search page and press its "Buscar" button with
 * `filters` over the search form's fields. The form id is a JSF `j_id` that
 * changes between releases, so it is read from the page (the one field
 * without a colon) and handed back with the result page.
 */
export const submitGobexSearch = async (
  client: HttpClient,
  url: string,
  filters: (formId: string) => Readonly<Record<string, string>>,
): Promise<GobexSearchSubmission> => {
  const page = await client.request(url, { timeoutMs: gobexTimeoutMs })
  const fields = selectImageButtonForm(page.text, page.url, 'bt_buscar')?.form
    .fields
  const formId = Object.keys(fields ?? {}).find((key) => !key.includes(':'))
  if (formId === undefined)
    throw new Error(`Junta: no search form at ${page.url}`)
  const results = await submitImageButton(
    client,
    page,
    'bt_buscar',
    filters(formId),
  )
  if (results.status >= 500)
    throw new Error(
      `Junta: the sede answered ${String(results.status)} to the search at ${url}; the error is on its side`,
    )
  return { results, formId }
}
