import { readPdfDocument } from '../parsers/readPdfDocument'
import type { PreparedPdfSignature } from '../types/PreparedPdfSignature'
import type { SignatureRequest } from '../types/SignatureRequest'
import { planSignatureObjects } from '../update/planSignatureObjects'
import { validateSignablePdf } from '../validators/validateSignablePdf'
import { appendUpdate } from '../writers/appendUpdate'
import { placeByteRange } from '../writers/placeByteRange'

/** Append the incremental update holding `request`'s signature dictionary and place its byte range, ready for the /Contents. */
export const preparePdfUpdate = (
  pdf: Buffer,
  request: SignatureRequest,
): PreparedPdfSignature => {
  const doc = readPdfDocument(pdf)
  validateSignablePdf(doc)
  return placeByteRange(
    appendUpdate(doc, planSignatureObjects(doc, request)),
    pdf.length,
  )
}
