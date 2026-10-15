import { pdfDictGet } from '../objects/pdfDictGet'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfValue } from '../types/PdfValue'
import { selectReferencePermission } from './selectReferencePermission'

/**
 * The permission level of a certified PDF's DocMDP signature (ISO 32000-1
 * 12.8.2.2): 1 no changes, 2 form filling and signing, 3 also annotations;
 * 2 when its references do not say.
 */
export const selectDocMdpPermission = (
  doc: PdfDocument,
  signature: PdfValue,
): number => {
  if (signature.kind !== 'dict') return 2
  const references = resolvePdfValue(doc, pdfDictGet(signature, 'Reference'))
  const items = references?.kind === 'array' ? references.items : []
  for (const item of items) {
    const level = selectReferencePermission(doc, item)
    if (level !== undefined) return level
  }
  return 2
}
