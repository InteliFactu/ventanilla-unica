import type { HttpClient } from '../../../http/types/HttpClient'
import { aeatBaseUrl } from '../../session/aeatBaseUrl'

/**
 * POST one already-urlencoded body to an EMCE-JDIT certificate servlet. The
 * body is pure ASCII (every non-ASCII byte is percent-encoded in Latin-1
 * upstream), so the client's UTF-8 length framing is exact.
 */
export const postEmceForm = async (
  client: HttpClient,
  servlet: string,
  body: string,
): Promise<string> => {
  const response = await client.request(
    `${aeatBaseUrl}/wlpl/EMCE-JDIT/${servlet}`,
    {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
      },
      defaultCharset: 'iso-8859-1',
    },
  )
  return response.text
}
