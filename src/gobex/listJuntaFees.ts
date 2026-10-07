import type { HttpClient } from '../http/types/HttpClient'
import { searchGobexReport } from './fetchers/searchGobexReport'
import { gobexUrls } from './session/gobexUrls'
import { loginWithClave } from './session/loginWithClave'
import type { JuntaFees } from './types/JuntaFees'

/** The holder's Junta de Extremadura fees (tasas): the paid ones and the payment incidents. */
export const listJuntaFees = async (client: HttpClient): Promise<JuntaFees> => {
  await loginWithClave(client)
  return {
    paid: (await searchGobexReport(client, gobexUrls.paidFees)).rows,
    incidents: (await searchGobexReport(client, gobexUrls.feeIncidents)).rows,
  }
}
