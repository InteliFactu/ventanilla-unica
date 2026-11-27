import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/**
 * GET MisPagos: the whole payment history of the certificate's NIF in one
 * table (the 10-per-page pagination is client-side script). The page declares
 * no charset and prints the euro sign as byte 0x80, which is Windows-1252,
 * not the ISO-8859-15 of the debt pages.
 */
export const fetchPaymentsPage = async (
  client: HttpClient,
): Promise<string> => {
  const response = await client.request(
    `${aeatBaseUrl}/wlpl/OVPP-PAGO/MisPagos`,
    { defaultCharset: 'windows-1252' },
  )
  if (response.status !== 200)
    throw new Error(`AEAT: MisPagos answered HTTP ${String(response.status)}`)
  return response.text
}
