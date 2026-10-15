import type { PdfDict } from './PdfDict'
import type { PdfUpdateObject } from './PdfUpdateObject'

/** The objects a signature field writes, and how the AcroForm must change for it. */
export type FieldPlan = {
  readonly objects: readonly PdfUpdateObject[]
  readonly editForm: (form: PdfDict) => PdfDict
}
