import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/** GET the list of banks adhered to "pago de liquidaciones con cargo en cuenta" (idcodOpe=002). */
export const fetchCollaboratingEntities = async (
  client: HttpClient,
): Promise<string> => {
  const response = await client.request(
    `${aeatBaseUrl}/wlpl/OVPP-PAGO/VerEntidadesAdheridas?idcodOpe=002`,
    { defaultCharset: 'iso-8859-15' },
  )
  if (response.status !== 200)
    throw new Error(
      `AEAT: VerEntidadesAdheridas answered HTTP ${String(response.status)}`,
    )
  return response.text
}
