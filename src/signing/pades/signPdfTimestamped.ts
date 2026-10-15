import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildSignedData } from '../cms/buildSignedData'
import { postTimestampQuery } from '../tsp/fetchers/postTimestampQuery'
import { timestampSignedData } from '../tsp/timestampSignedData'
import type { TimestampPost } from '../tsp/types/TimestampPost'
import { digestByteRanges } from './mappers/digestByteRanges'
import { preparePdfSignature } from './mappers/preparePdfSignature'
import type { SignPdfTimestampedOptions } from './types/SignPdfTimestampedOptions'
import { writeSignatureContents } from './writers/writeSignatureContents'

/**
 * `signPdf` with a signature timestamp from `authority` inside the CMS
 * (PAdES-B-T, AutoFirma's `tsType=1`).
 */
export const signPdfTimestamped = async (
  identity: CertificateIdentity,
  pdf: Buffer,
  options: SignPdfTimestampedOptions,
  post: TimestampPost = postTimestampQuery,
): Promise<Buffer> => {
  const prepared = preparePdfSignature(identity, pdf, options)
  const digest = options.digest ?? 'sha256'
  const cms = buildSignedData(identity, digestByteRanges(prepared, digest), {
    digest,
    policy: options.policy,
  })
  return writeSignatureContents(
    prepared,
    await timestampSignedData(cms, options.timestamp, post),
  )
}
