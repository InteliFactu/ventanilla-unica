import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { readPdfDocument } from '../parsers/readPdfDocument'
import { selectCommonName } from '../selectors/selectCommonName'
import type { PreparedPdfSignature } from '../types/PreparedPdfSignature'
import type { SignPdfOptions } from '../types/SignPdfOptions'
import { planSignatureObjects } from '../update/planSignatureObjects'
import { validateSignablePdf } from '../validators/validateSignablePdf'
import { appendUpdate } from '../writers/appendUpdate'
import { placeByteRange } from '../writers/placeByteRange'
import { signatureRequestOf } from './signatureRequestOf'

/** Append the signature's incremental update to `pdf` and place its byte range, ready for the CMS. */
export const preparePdfSignature = (
  identity: CertificateIdentity,
  pdf: Buffer,
  options: SignPdfOptions,
): PreparedPdfSignature => {
  const doc = readPdfDocument(pdf)
  validateSignablePdf(doc)
  const objects = planSignatureObjects(
    doc,
    signatureRequestOf(selectCommonName(identity), options),
  )
  return placeByteRange(appendUpdate(doc, objects), pdf.length)
}
