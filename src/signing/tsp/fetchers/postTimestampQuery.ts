import { timestampReplyLimit } from '../timestampReplyLimit'
import type { TimestampPost } from '../types/TimestampPost'

/**
 * POST a TimeStampReq to the TSA over HTTP(S), RFC 3161 section 3.4. No
 * certificate is presented: the query carries only a digest.
 */
export const postTimestampQuery: TimestampPost = async (url, query) => {
  const { protocol } = new URL(url)
  if (protocol !== 'https:' && protocol !== 'http:')
    throw new Error(`a TSA URL is http or https: ${url}`)
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/timestamp-query' },
    body: query,
    signal: AbortSignal.timeout(30_000),
  })
  const body = Buffer.from(await response.arrayBuffer())
  if (!response.ok || body.length > timestampReplyLimit)
    throw new Error(`the TSA answered ${String(response.status)}`)
  return body
}
