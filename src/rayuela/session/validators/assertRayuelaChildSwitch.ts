import { mapRayuelaSwitcherChoices } from '../mappers/mapRayuelaSwitcherChoices'
import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'

/** The active child is the sole roster member absent from the current switcher. */
export const assertRayuelaChildSwitch = (
  children: readonly RayuelaChildChoice[],
  choices: readonly RayuelaChildChoice[],
  nia: string,
): void => {
  const choicesByNia = mapRayuelaSwitcherChoices(children, choices)
  if (children.length - choicesByNia.size !== 1 || choicesByNia.has(nia))
    throw new Error('Rayuela did not confirm the selected child')
}
