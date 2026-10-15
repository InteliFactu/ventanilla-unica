import { pdfDictGet } from '../objects/pdfDictGet'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import type { PdfDocument } from '../types/PdfDocument'
import { selectCatalog } from './selectCatalog'
import { selectDocMdpPermission } from './selectDocMdpPermission'

/** The certification level of a certified PDF (catalog /Perms /DocMDP), or undefined. */
export const selectCertificationLevel = (
  doc: PdfDocument,
): number | undefined => {
  const permissions = resolvePdfValue(
    doc,
    pdfDictGet(selectCatalog(doc).dict, 'Perms'),
  )
  if (permissions?.kind !== 'dict') return undefined
  const signature = resolvePdfValue(doc, pdfDictGet(permissions, 'DocMDP'))
  return signature === undefined
    ? undefined
    : selectDocMdpPermission(doc, signature)
}
