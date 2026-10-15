import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfPage } from '../types/PdfPage'
import { selectPages } from './selectPages'

/** The 1-based `page`, or counting from the end when negative (-1 is the last). */
export const selectPage = (
  doc: PdfDocument,
  catalog: PdfDict,
  page: number,
): PdfPage => {
  const pages = selectPages(doc, catalog)
  const found = pages.at(page > 0 ? page - 1 : page)
  if (page === 0 || found === undefined)
    throw new Error(
      `page ${String(page)} does not exist (the PDF has ${String(pages.length)})`,
    )
  return found
}
