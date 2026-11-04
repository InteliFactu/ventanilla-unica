import type { RelecPlan } from './RelecPlan'
import type { RelecTramitePlan } from './RelecTramitePlan'

/** What to save beside the receipt, and where, if `--out` was given. */
export type RelecOutputTarget = {
  readonly plan: RelecPlan | RelecTramitePlan
  readonly outDir?: string | undefined
}
