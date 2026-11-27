import type { RelecInstancePlan } from './RelecInstancePlan'
import type { RelecTramiteVariable } from './RelecTramiteVariable'

/** A validated own-name catalogue filing, including its selected procedure id. */
export type RelecTramitePlan = RelecInstancePlan & {
  readonly dboid: string
  readonly represented?: undefined
  readonly variables: readonly RelecTramiteVariable[]
}
