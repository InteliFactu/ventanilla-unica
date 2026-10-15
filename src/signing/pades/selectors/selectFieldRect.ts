import { pdfDictGet } from '../objects/pdfDictGet'
import { pdfRawNumber } from '../objects/pdfRawNumber'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'

/** A widget's /Rect as [llx lly urx ury], or undefined when it has no area (an invisible field). */
export const selectFieldRect = (
  doc: PdfDocument,
  widget: PdfDict,
): number[] | undefined => {
  const rect = resolvePdfValue(doc, pdfDictGet(widget, 'Rect'))
  const box =
    rect?.kind === 'array'
      ? rect.items.map((item) => pdfRawNumber(item) ?? 0)
      : []
  const [llx = 0, lly = 0, urx = 0, ury = 0] = box
  return urx > llx && ury > lly ? [llx, lly, urx, ury] : undefined
}
