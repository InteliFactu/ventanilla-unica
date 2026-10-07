import type { FilingDocument } from './FilingDocument'
import type { FilingForm } from './FilingForm'

/** The opened filing form and the documents read for it. */
export type PreparedDocumentFiling = {
  form: FilingForm
  documents: FilingDocument[]
}
