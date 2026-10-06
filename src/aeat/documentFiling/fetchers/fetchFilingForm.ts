import type { HttpClient } from '../../../http/types/HttpClient'
import { documentFilingUrls } from '../documentFilingUrls'
import type { AeatPage } from '../types/AeatPage'
import type { FilingRole } from '../types/FilingRole'

/**
 * Open the step-1 form for a CSV, as the page's "Con identificación" button
 * does. The registry resolves the CSV to its procedure (for a sancionador,
 * GZ706 "Contestar requerimientos, efectuar alegaciones...") and redirects to
 * `FG` pre-filled; nothing is saved by opening it.
 */
export const fetchFilingForm = async (
  client: HttpClient,
  csv: string,
  role: FilingRole,
): Promise<AeatPage> => {
  const query = new URLSearchParams({
    fCSV: csv,
    accion: 'obtenerDatos',
    fRecurso: '',
    fTramite: '',
    fTipoIdentificacion: 'S',
    fTipoRepresentacion: role,
  })
  const response = await client.request(
    `${documentFilingUrls.csvForm}?${query.toString()}`,
    { defaultCharset: 'iso-8859-15' },
  )
  if (response.status !== 200)
    throw new Error(
      `AEAT: the CSV registry answered HTTP ${String(response.status)}`,
    )
  return { url: response.url, html: response.text }
}
