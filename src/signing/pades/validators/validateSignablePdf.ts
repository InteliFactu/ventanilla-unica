import { selectCertificationLevel } from '../selectors/selectCertificationLevel'
import type { PdfDocument } from '../types/PdfDocument'

/**
 * Refuse a PDF certified with no changes allowed (DocMDP P=1): a new
 * signature would invalidate its certification. AutoFirma refuses the same
 * unless told otherwise (`PdfUtil.checkPdfCertification`).
 */
export const validateSignablePdf = (doc: PdfDocument): void => {
  if (selectCertificationLevel(doc) === 1)
    throw new Error(
      'the PDF is certified with no changes allowed (DocMDP P=1): signing it would break its certification',
    )
}
