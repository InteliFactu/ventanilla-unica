import type { RelecPlan } from './RelecPlan'
import type { RelecTramitePlan } from './RelecTramitePlan'

/** The plan saved beside the receipt and the directory both go to. */
export type RelecSaveTarget = {
  readonly plan: RelecPlan | RelecTramitePlan
  readonly outDir: string
}
