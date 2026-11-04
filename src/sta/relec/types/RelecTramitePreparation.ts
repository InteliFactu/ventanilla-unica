import type { RelecForm } from './RelecForm'
import type { RelecTramitePlan } from './RelecTramitePlan'
import type { RelecUploadTarget } from './RelecUploadTarget'

/** Read-only preparation of one own-name catalogue filing. */
export type RelecTramitePreparation = {
  readonly origin: string
  readonly formUrl: string
  readonly form: RelecForm
  readonly plan: RelecTramitePlan
  readonly targets: readonly RelecUploadTarget[]
}
