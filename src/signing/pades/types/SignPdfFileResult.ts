import type { PdfSubFilter } from './PdfSubFilter'

/** What `ventanilla-unica firmar pdf` reports once the signed copy is written. */
export type SignPdfFileResult = {
  readonly input: string
  readonly output: string
  readonly bytes: number
  readonly signer: string
  readonly visible: boolean
  readonly subFilter: PdfSubFilter
}
