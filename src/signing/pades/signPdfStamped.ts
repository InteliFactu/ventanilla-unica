import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { postTimestampQuery } from '../tsp/fetchers/postTimestampQuery'
import type { TimestampPost } from '../tsp/types/TimestampPost'
import { signPdf } from './signPdf'
import { signPdfTimestamped } from './signPdfTimestamped'
import { timestampPdfDocument } from './timestampPdfDocument'
import type { PdfTimestamps } from './types/PdfTimestamps'
import type { SignPdfOptions } from './types/SignPdfOptions'

/** Sign a PDF with the timestamps asked for, in AutoFirma's order: the document timestamp first, then the signature, stamped or not. */
export const signPdfStamped = async (
  identity: CertificateIdentity,
  pdf: Buffer,
  options: SignPdfOptions & PdfTimestamps,
  post: TimestampPost = postTimestampQuery,
): Promise<Buffer> => {
  const input =
    options.documentTimestamp === undefined
      ? pdf
      : await timestampPdfDocument(pdf, options.documentTimestamp, post)
  return options.timestamp === undefined
    ? signPdf(identity, input, options)
    : signPdfTimestamped(
        identity,
        input,
        { ...options, timestamp: options.timestamp },
        post,
      )
}
