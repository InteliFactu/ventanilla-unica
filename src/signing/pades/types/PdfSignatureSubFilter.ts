import type { PdfSubFilter } from './PdfSubFilter'

/** Every /SubFilter a signature dictionary written here can carry: a signature's, or ETSI.RFC3161 for a document timestamp. */
export type PdfSignatureSubFilter = PdfSubFilter | 'ETSI.RFC3161'
