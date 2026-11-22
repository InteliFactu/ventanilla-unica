import type { HttpClient } from '../../../http/types/HttpClient'
import { documentFilingUrls } from '../documentFilingUrls'
import type { AeatPage } from '../types/AeatPage'

/**
 * Open the step-1 form of a trámite without a CSV, as a procedure's
 * "Presentación de recurso o solicitud" link does (GZ285 for "Rectificación
 * de autoliquidaciones de Gestión Tributaria"). Nothing is saved by opening it.
 */
export const fetchProcedureForm = async (
  client: HttpClient,
  tramite: string,
): Promise<AeatPage> => {
  const response = await client.request(
    `${documentFilingUrls.form}?${new URLSearchParams({ fTramite: tramite }).toString()}`,
    { defaultCharset: 'iso-8859-15' },
  )
  if (response.status !== 200)
    throw new Error(
      `AEAT: the registry answered HTTP ${String(response.status)} for trámite ${tramite}`,
    )
  return { url: response.url, html: response.text }
}
