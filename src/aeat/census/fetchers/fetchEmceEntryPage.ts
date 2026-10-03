import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/**
 * GET one EMCE-JDIT certificate servlet (`ServletSitCenInternet`,
 * `ECOTInternetCiudadanosServlet`): the request form with its `fIslw`
 * session token.
 */
export const fetchEmceEntryPage = async (
  client: HttpClient,
  servlet: string,
): Promise<string> => {
  const response = await client.request(
    `${aeatBaseUrl}/wlpl/EMCE-JDIT/${servlet}`,
    { defaultCharset: 'iso-8859-1' },
  )
  return response.text
}
