import { postTimestampQuery } from '../tsp/fetchers/postTimestampQuery'
import { requestTimestampToken } from '../tsp/requestTimestampToken'
import type { TimestampAuthority } from '../tsp/types/TimestampAuthority'
import type { TimestampPost } from '../tsp/types/TimestampPost'
import { preparePdfUpdate } from './mappers/preparePdfUpdate'
import { selectByteRangeBytes } from './selectors/selectByteRangeBytes'
import { writeSignatureContents } from './writers/writeSignatureContents'

/**
 * Add an invisible document timestamp (/DocTimeStamp, ETSI.RFC3161) over the
 * whole PDF by incremental update: the TimeStampToken itself is the
 * /Contents. AutoFirma's `tsType` 2 and 3 apply it before signing.
 */
export const timestampPdfDocument = async (
  pdf: Buffer,
  authority: TimestampAuthority,
  post: TimestampPost = postTimestampQuery,
  date: Date = new Date(),
): Promise<Buffer> => {
  const prepared = preparePdfUpdate(pdf, {
    commonName: '',
    date,
    subFilter: 'ETSI.RFC3161',
    stampLines: undefined,
    page: 1,
    rect: [0, 0, 0, 0],
    field: undefined,
  })
  const token = await requestTimestampToken(
    selectByteRangeBytes(prepared),
    authority,
    post,
  )
  return writeSignatureContents(prepared, token)
}
