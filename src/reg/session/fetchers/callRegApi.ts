import type { HttpClient } from '../../../http/types/HttpClient'
import { buildRegHeaders } from '../builders/buildRegHeaders'
import { regUrls } from '../regUrls'
import type { RegApiBody } from '../types/RegApiBody'

/**
 * Call one REG API path with the bearer token and parse the JSON answer. A
 * string body is sent as JSON, a `RegApiBody` as given (the multipart upload).
 */
export const callRegApi = async (
  client: HttpClient,
  token: string | undefined,
  path: string,
  body?: string | RegApiBody,
): Promise<unknown> => {
  const payload =
    typeof body === 'string' ? { body, contentType: 'application/json' } : body
  const response = await client.request(`${regUrls.api}${path}`, {
    method: payload === undefined ? 'GET' : 'POST',
    body: payload?.body,
    headers: buildRegHeaders(token, payload?.contentType),
    referer: `${regUrls.origin}/`,
    timeoutMs: 120_000,
  })
  const ok = 200
  const lastOk = 299
  if (response.status < ok || response.status > lastOk)
    throw new Error(
      `REG: ${path} answered ${String(response.status)}: ${response.text.slice(0, 300)}`,
    )
  return JSON.parse(response.text) as unknown
}
