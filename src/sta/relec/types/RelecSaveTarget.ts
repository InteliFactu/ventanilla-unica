import type { RelecPlan } from './RelecPlan'

/** The plan saved beside the receipt and the directory both go to. */
export type RelecSaveTarget = {
  readonly plan: RelecPlan
  readonly outDir: string
}
