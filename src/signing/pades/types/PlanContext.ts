import type { ObjectAllocator } from './ObjectAllocator'
import type { PdfDict } from './PdfDict'
import type { PdfDocument } from './PdfDocument'
import type { PdfRef } from './PdfRef'
import type { SignatureRequest } from './SignatureRequest'

/** What planning the field of a signature works from. */
export type PlanContext = {
  readonly doc: PdfDocument
  readonly catalog: PdfDict
  readonly allocator: ObjectAllocator
  /** The signature dictionary the field's /V will name. */
  readonly signature: PdfRef
  readonly request: SignatureRequest
}
