import type { RelecInstancePlan } from './RelecInstancePlan'

/** A validated own-name catalogue filing, including its selected procedure id. */
export type RelecTramitePlan = RelecInstancePlan & {
  readonly dboid: string
  readonly represented?: undefined
}
