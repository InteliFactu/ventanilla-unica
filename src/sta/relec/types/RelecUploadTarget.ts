import type { RelecDocument } from './RelecDocument'
import type { RelecDocumentType } from './RelecDocumentType'

/** One document slot of the form: its index, the represented entity's dboid, the document and its type. */
export type RelecUploadTarget = {
  readonly origin: string
  readonly slot: number
  readonly person: string
  readonly document: RelecDocument
  readonly type: RelecDocumentType
}
