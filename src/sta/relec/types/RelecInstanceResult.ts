import type { WriteResult } from '../../../write/types/WriteResult'
import type { RelecInstancePlan } from './RelecInstancePlan'

/** The answer of `caceres instancia`: the plan only, since the act is not captured. */
export type RelecInstanceResult = WriteResult<never> & {
  readonly filing: RelecInstancePlan
}
