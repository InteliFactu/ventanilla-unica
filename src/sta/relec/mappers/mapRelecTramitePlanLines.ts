import type { RelecTramitePlan } from '../types/RelecTramitePlan'
import { mapRelecInstancePlanLines } from './mapRelecInstancePlanLines'

/** Include reviewed dynamic field values in the catalogue filing plan. */
export const mapRelecTramitePlanLines = (
  plan: RelecTramitePlan,
): readonly string[] => [
  ...plan.variables.map(
    ({ name, label, value }) => `${label || name}: ${value}`,
  ),
  ...mapRelecInstancePlanLines(plan),
]
