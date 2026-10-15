import { pdfDictGet } from '../objects/pdfDictGet'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import { readPdfObject } from '../parsers/readPdfObject'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfPage } from '../types/PdfPage'
import type { PdfValue } from '../types/PdfValue'

/**
 * Every leaf page in document order, walking /Pages and its /Kids depth
 * first. Each node is read once: a hostile tree that repeats or loops its
 * /Kids is refused rather than walked exponentially.
 */
export const selectPages = (doc: PdfDocument, catalog: PdfDict): PdfPage[] => {
  const pages: PdfPage[] = []
  const visited = new Set<number>()
  const pending: (PdfValue | undefined)[] = [pdfDictGet(catalog, 'Pages')]
  while (pending.length > 0) {
    const node = pending.shift()
    if (node?.kind !== 'ref')
      throw new Error('page tree node is not a reference')
    if (visited.has(node.num))
      throw new Error('page tree repeats or loops a node')
    visited.add(node.num)
    const dict = readPdfObject(doc, node.num)
    if (dict.kind !== 'dict')
      throw new Error('page tree node is not a dictionary')
    const kids = resolvePdfValue(doc, pdfDictGet(dict, 'Kids'))
    if (kids?.kind === 'array') pending.unshift(...kids.items)
    else pages.push({ ref: node, dict })
  }
  return pages
}
