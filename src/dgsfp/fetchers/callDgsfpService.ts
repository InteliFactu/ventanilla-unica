import type { HttpClient } from '../../http/types/HttpClient'
import { readServiceError } from '../parsers/readServiceError'
import { dgsfpUrls } from '../session/dgsfpUrls'

/**
 * Call one of the sede's WCF services under `/es/Auth/_vti_bin` with the
 * headers the page's own `fetch` sends, and parse the JSON answer. A body
 * makes it a POST; WCF answers "unexpected message format 'Raw'" unless the
 * content type is JSON. A 400 carries the sede's message for the user.
 */
export const callDgsfpService = async (
  client: HttpClient,
  digest: string,
  path: string,
  body?: unknown,
): Promise<unknown> => {
  const response = await client.request(`${dgsfpUrls.authServices}/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
    referer: dgsfpUrls.formPage,
    headers: {
      'X-RequestDigest': digest,
      Accept: 'application/json; odata=verbose',
      'Content-Type': 'application/json; odata=verbose',
    },
    timeoutMs: 300_000,
  })
  const ok = 200
  const lastOk = 299
  if (response.status < ok || response.status > lastOk)
    throw new Error(readServiceError(path, response.status, response.text))
  return JSON.parse(response.text) as unknown
}
