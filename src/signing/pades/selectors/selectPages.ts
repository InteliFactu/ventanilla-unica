import { pdfDictGet } from '../objects/pdfDictGet'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import { readPdfObject } from '../parsers/readPdfObject'
import type { PageTreeCursor } from '../types/PageTreeCursor'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfPage } from '../types/PdfPage'

/** Every leaf page in document order, walking /Pages and its /Kids depth first. */
export const selectPages = (doc: PdfDocument, catalog: PdfDict): PdfPage[] => {
  const pages: PdfPage[] = []
  const pending: PageTreeCursor[] = [
    { node: pdfDictGet(catalog, 'Pages'), depth: 0 },
  ]
  while (pending.length > 0) {
    const { node, depth } = pending.shift() ?? { node: undefined, depth: 0 }
    if (node?.kind !== 'ref')
      throw new Error('page tree node is not a reference')
    if (depth > 64) throw new Error('page tree too deep')
    const dict = readPdfObject(doc, node.num)
    if (dict.kind !== 'dict')
      throw new Error('page tree node is not a dictionary')
    const kids = resolvePdfValue(doc, pdfDictGet(dict, 'Kids'))
    if (kids?.kind === 'array')
      pending.unshift(
        ...kids.items.map((kid) => ({ node: kid, depth: depth + 1 })),
      )
    else pages.push({ ref: node, dict })
  }
  return pages
}
