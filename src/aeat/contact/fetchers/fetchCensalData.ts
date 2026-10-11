import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/** GET Mis datos censales (MdcAcceso), which also opens the AEAT session. */
export const fetchCensalData = async (client: HttpClient): Promise<string> => {
  const response = await client.request(
    `${aeatBaseUrl}/wlpl/BUGC-JDIT/MdcAcceso`,
  )
  if (response.status !== 200)
    throw new Error(
      `AEAT: Mis datos censales answered HTTP ${String(response.status)}; the certificate is not accepted for this service`,
    )
  return response.text
}
