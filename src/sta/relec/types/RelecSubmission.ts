import type { FormPair } from '../../../http/types/FormPair'
import type { RelecUploadTarget } from './RelecUploadTarget'

/** A prepared form and its exact upload targets; used only after confirmation. */
export type RelecSubmission = {
  readonly origin: string
  readonly formUrl: string
  readonly pairs: readonly FormPair[]
  readonly targets: readonly RelecUploadTarget[]
}
