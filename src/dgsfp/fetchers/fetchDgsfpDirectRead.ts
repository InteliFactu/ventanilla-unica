import type { HttpClient } from '../../http/types/HttpClient'
import { dgsfpUrls } from '../session/dgsfpUrls'

/** Fetch an authenticated read response from its exact requested endpoint. */
export const fetchDgsfpDirectRead = async (
  client: HttpClient,
  digest: string,
  path: string,
): Promise<string> => {
  const url = `${dgsfpUrls.authServices}/${path}`
  const response = await client.request(url, {
    method: 'GET',
    followRedirects: false,
    referer: dgsfpUrls.formPage,
    headers: {
      'X-RequestDigest': digest,
      Accept: 'application/json; odata=verbose',
      'Content-Type': 'application/json; odata=verbose',
      'Cache-Control': 'no-cache',
    },
  })
  if (response.status !== 200) {
    throw new Error(
      `DGSFP: the authenticated read failed (HTTP ${String(response.status)})`,
    )
  }
  if (response.url !== url) {
    throw new Error('DGSFP: the authenticated read left the requested endpoint')
  }
  return response.text
}
