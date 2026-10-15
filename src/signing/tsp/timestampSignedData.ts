import { cmsAttribute } from '../cms/cmsAttribute'
import { cmsOids } from '../cms/cmsOids'
import { selectSignatureValue } from '../cms/selectors/selectSignatureValue'
import { appendUnsignedAttribute } from '../cms/writers/appendUnsignedAttribute'
import { postTimestampQuery } from './fetchers/postTimestampQuery'
import { requestTimestampToken } from './requestTimestampToken'
import type { TimestampAuthority } from './types/TimestampAuthority'
import type { TimestampPost } from './types/TimestampPost'

/**
 * Turn a CAdES-B signature into CAdES-T: ask the TSA to stamp the signature
 * value and add the token as the signature-time-stamp unsigned attribute
 * (ETSI EN 319 122-1 5.3).
 */
export const timestampSignedData = async (
  cms: Buffer,
  authority: TimestampAuthority,
  post: TimestampPost = postTimestampQuery,
): Promise<Buffer> => {
  const token = await requestTimestampToken(
    selectSignatureValue(cms),
    authority,
    post,
  )
  return appendUnsignedAttribute(
    cms,
    cmsAttribute(cmsOids.signatureTimeStampToken, [token]),
  )
}
