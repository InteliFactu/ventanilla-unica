import type { PdfSubFilter } from './PdfSubFilter'

/** What the signature says about itself: who, when, why, where and how to reach them. */
export type SignatureDetails = {
  readonly commonName: string
  readonly date: Date
  readonly reason?: string | undefined
  readonly location?: string | undefined
  readonly contactInfo?: string | undefined
  /** ETSI.CAdES.detached by default. */
  readonly subFilter?: PdfSubFilter | undefined
}
