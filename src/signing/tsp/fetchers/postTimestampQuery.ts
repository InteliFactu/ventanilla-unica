import type { TimestampPost } from '../types/TimestampPost'
import { validateTsaUrl } from '../validators/validateTsaUrl'
import { sendTimestampRequest } from './sendTimestampRequest'

/**
 * POST a TimeStampReq to the TSA over HTTP(S), RFC 3161 section 3.4. No
 * certificate is presented: the query carries only a digest. The URL may
 * come from a sede page, so internal hosts are refused, both by name and by
 * the address the name resolves to, and redirects are not followed.
 */
export const postTimestampQuery: TimestampPost = async (url, query) => {
  validateTsaUrl(url)
  const reply = await sendTimestampRequest(new URL(url), query)
  if (reply.status < 200 || reply.status > 299)
    throw new Error(`the TSA answered ${String(reply.status)}`)
  return reply.body
}
