import { pdfDictGet } from '../objects/pdfDictGet'
import { pdfRawNumber } from '../objects/pdfRawNumber'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfValue } from '../types/PdfValue'

/**
 * The /P of one signature reference dictionary when it is the DocMDP one
 * (2, the default, when /P is absent); undefined for any other reference.
 */
export const selectReferencePermission = (
  doc: PdfDocument,
  item: PdfValue,
): number | undefined => {
  const reference = resolvePdfValue(doc, item)
  if (reference?.kind !== 'dict') return undefined
  const method = pdfDictGet(reference, 'TransformMethod')
  if (method?.kind !== 'raw' || method.text !== '/DocMDP') return undefined
  const params = resolvePdfValue(doc, pdfDictGet(reference, 'TransformParams'))
  if (params?.kind !== 'dict') return 2
  return pdfRawNumber(pdfDictGet(params, 'P')) ?? 2
}
