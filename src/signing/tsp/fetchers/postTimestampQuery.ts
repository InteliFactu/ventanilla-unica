import { timestampReplyLimit } from '../timestampReplyLimit'
import type { TimestampPost } from '../types/TimestampPost'
import { validateTsaUrl } from '../validators/validateTsaUrl'

/**
 * POST a TimeStampReq to the TSA over HTTP(S), RFC 3161 section 3.4. No
 * certificate is presented: the query carries only a digest. The URL may
 * come from a sede page, so internal hosts are refused and redirects are not
 * followed.
 */
export const postTimestampQuery: TimestampPost = async (url, query) => {
  validateTsaUrl(url)
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/timestamp-query' },
    body: query,
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  })
  const body = Buffer.from(await response.arrayBuffer())
  if (!response.ok || body.length > timestampReplyLimit)
    throw new Error(`the TSA answered ${String(response.status)}`)
  return body
}
