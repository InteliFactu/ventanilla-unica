import { createHash } from 'node:crypto'

import { cmsAttribute } from '../cms/cmsAttribute'
import { cmsOids } from '../cms/cmsOids'
import { selectSignatureValue } from '../cms/selectors/selectSignatureValue'
import { appendUnsignedAttribute } from '../cms/writers/appendUnsignedAttribute'
import { buildTimestampNonce } from './builders/buildTimestampNonce'
import { buildTimeStampReq } from './builders/buildTimeStampReq'
import { postTimestampQuery } from './fetchers/postTimestampQuery'
import { readTimestampToken } from './parsers/readTimestampToken'
import type { TimestampAuthority } from './types/TimestampAuthority'
import type { TimestampPost } from './types/TimestampPost'

/**
 * Turn a CAdES-B signature into CAdES-T: ask the TSA to stamp the digest of
 * the signature value and add the token as the signature-time-stamp unsigned
 * attribute (ETSI EN 319 122-1 5.3).
 */
export const timestampSignedData = async (
  cms: Buffer,
  authority: TimestampAuthority,
  post: TimestampPost = postTimestampQuery,
): Promise<Buffer> => {
  const digest = authority.digest ?? 'sha512'
  const query = {
    digest,
    imprint: createHash(digest).update(selectSignatureValue(cms)).digest(),
    policy: authority.policy,
    nonce: buildTimestampNonce(),
  }
  const reply = await post(authority.url, buildTimeStampReq(query))
  const token = readTimestampToken(reply, query)
  return appendUnsignedAttribute(
    cms,
    cmsAttribute(cmsOids.signatureTimeStampToken, [token]),
  )
}
