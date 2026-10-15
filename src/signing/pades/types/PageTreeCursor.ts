import type { PdfValue } from './PdfValue'

/** A page tree node still to visit, and how deep it sits. */
export type PageTreeCursor = {
  readonly node: PdfValue | undefined
  readonly depth: number
}
