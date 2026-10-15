import type { HttpClient } from '../../http/types/HttpClient'
import { staPageUrl } from '../session/staPageUrl'

/** Open a private STA page and return its HTML, refusing a page served without the session. */
export const fetchStaPageText = async (
  client: HttpClient,
  origin: string,
  pageCode: string,
): Promise<string> => {
  const response = await client.request(staPageUrl(origin, pageCode))
  if (!response.text.includes('CarpetaPrivate/Logout'))
    throw new Error(`${new URL(origin).hostname}: session lost on ${pageCode}`)
  return response.text
}
