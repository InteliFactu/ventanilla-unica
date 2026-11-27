import { normalizeRayuelaName } from '../selectors/normalizeRayuelaName'
import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'

/** Match each switcher choice to exactly one roster NIA. Switcher IDs can differ from NIAs. */
export const mapRayuelaSwitcherChoices = (
  children: readonly RayuelaChildChoice[],
  choices: readonly RayuelaChildChoice[],
): ReadonlyMap<string, RayuelaChildChoice> => {
  const choicesByNia = new Map<string, RayuelaChildChoice>()
  const switchIds = new Set<string>()
  for (const choice of choices) {
    if (switchIds.has(choice.id))
      throw new Error(`Rayuela returned duplicate switcher id ${choice.id}`)
    switchIds.add(choice.id)
    const label = normalizeRayuelaName(choice.name)
    const matches = children.filter(
      (child) => normalizeRayuelaName(child.name) === label,
    )
    const [child] = matches
    if (matches.length !== 1 || !child || choicesByNia.has(child.id))
      throw new Error(
        `Rayuela switcher entry ${choice.id}: ${choice.name} does not map to a distinct child of the account`,
      )
    choicesByNia.set(child.id, choice)
  }
  return choicesByNia
}
