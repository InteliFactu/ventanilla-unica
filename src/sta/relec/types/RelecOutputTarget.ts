import type { RelecPlan } from './RelecPlan'

/** What to save beside the receipt, and where, if `--out` was given. */
export type RelecOutputTarget = {
  readonly plan: RelecPlan
  readonly outDir?: string | undefined
}
