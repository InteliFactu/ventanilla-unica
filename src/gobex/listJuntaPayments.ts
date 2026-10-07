import type { HttpClient } from '../http/types/HttpClient'
import { searchGobexReport } from './fetchers/searchGobexReport'
import { gobexUrls } from './session/gobexUrls'
import { loginWithClave } from './session/loginWithClave'
import type { GobexRecord } from './types/GobexRecord'
import type { JuntaPayments } from './types/JuntaPayments'

/**
 * What the Junta de Extremadura and its bodies paid or owe the holder in one
 * year (subsidies, refunds, supplier payments), from "Mis pagos". The search
 * takes one sociedad at a time, so every one is asked, as payee and as
 * assignee, paid or pending. The page also carries the holder's "incidencias
 * del tercero" (an embargo, a debt set-off), the same for every search.
 */
export const listJuntaPayments = async (
  client: HttpClient,
  ejercicio: string,
): Promise<JuntaPayments> => {
  await loginWithClave(client)
  const payments: GobexRecord[] = []
  let incidents: readonly GobexRecord[] = []
  for (const company of gobexUrls.paymentCompanies) {
    const search = await searchGobexReport(
      client,
      gobexUrls.payments,
      (form) => ({
        [`${form}:ejercicio`]: ejercicio,
        [`${form}:sociedad`]: company,
        [`${form}:tipoConsulta`]: '3',
        [`${form}:estatus`]: '3',
      }),
    )
    payments.push(...search.rows.map((row) => ({ company, ...row })))
    incidents = search.otherGrids['tablaIncidencias'] ?? incidents
  }
  return { ejercicio, payments, incidents }
}
