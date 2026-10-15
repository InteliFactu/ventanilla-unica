import { createHash } from 'node:crypto'

import { buildTimestampNonce } from './builders/buildTimestampNonce'
import { buildTimeStampReq } from './builders/buildTimeStampReq'
import { postTimestampQuery } from './fetchers/postTimestampQuery'
import { readTimestampToken } from './parsers/readTimestampToken'
import type { TimestampAuthority } from './types/TimestampAuthority'
import type { TimestampPost } from './types/TimestampPost'

/** Ask `authority` to timestamp `data` (SHA-512 imprint by default) and return its checked TimeStampToken DER. */
export const requestTimestampToken = async (
  data: Buffer,
  authority: TimestampAuthority,
  post: TimestampPost = postTimestampQuery,
): Promise<Buffer> => {
  const digest = authority.digest ?? 'sha512'
  const query = {
    digest,
    imprint: createHash(digest).update(data).digest(),
    policy: authority.policy,
    nonce: buildTimestampNonce(),
  }
  const reply = await post(authority.url, buildTimeStampReq(query))
  return readTimestampToken(reply, query)
}
