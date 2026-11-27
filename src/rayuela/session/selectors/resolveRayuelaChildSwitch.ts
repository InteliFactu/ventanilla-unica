import { mapRayuelaSwitcherChoices } from '../mappers/mapRayuelaSwitcherChoices'
import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'
import type { RayuelaChildSelection } from '../types/RayuelaChildSelection'
import { selectRayuelaChild } from './selectRayuelaChild'

/** The sole child absent from the switcher is active and needs no switch. */
export const resolveRayuelaChildSwitch = (
  children: readonly RayuelaChildChoice[],
  choices: readonly RayuelaChildChoice[],
  query: string,
): RayuelaChildSelection => {
  const choicesByNia = mapRayuelaSwitcherChoices(children, choices)
  if (children.length - choicesByNia.size !== 1)
    throw new Error(
      'Rayuela current child cannot be identified from the switcher',
    )
  const nia = selectRayuelaChild(children, query, choicesByNia).id
  return { nia, switchId: choicesByNia.get(nia)?.id }
}
