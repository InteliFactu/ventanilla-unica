import { pdfDictGet } from '../objects/pdfDictGet'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import { readPdfObject } from '../parsers/readPdfObject'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfPage } from '../types/PdfPage'

/**
 * The AcroForm's top-level fields that are indirect dictionaries, with their
 * references. shortcut: fields nested under /Kids are not listed; add that
 * when a PDF needs it.
 */
export const selectFormFields = (
  doc: PdfDocument,
  form: PdfDict | undefined,
): PdfPage[] => {
  const fields = form && resolvePdfValue(doc, pdfDictGet(form, 'Fields'))
  const items = fields?.kind === 'array' ? fields.items : []
  return items.flatMap((item) => {
    if (item.kind !== 'ref') return []
    const dict = readPdfObject(doc, item.num)
    return dict.kind === 'dict' ? [{ ref: item, dict }] : []
  })
}
