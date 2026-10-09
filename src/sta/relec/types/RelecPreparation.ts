import type { RelecDocumentType } from './RelecDocumentType'
import type { RelecForm } from './RelecForm'
import type { RelecPlan } from './RelecPlan'

/** The read-only half of a filing: the form as served, the types it offers and the plan. */
export type RelecPreparation = {
  readonly origin: string
  /** The TramitaForm URL the browser would post TramitaSign from. */
  readonly formUrl: string
  readonly form: RelecForm
  readonly types: readonly RelecDocumentType[]
  readonly plan: RelecPlan
}
