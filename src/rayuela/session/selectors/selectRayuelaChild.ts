import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'
/** Refuse ambiguous fragments instead of silently picking a child. */
export const selectRayuelaChild = (
  children: readonly RayuelaChildChoice[],
  query: string,
  choicesByNia?: ReadonlyMap<string, RayuelaChildChoice>,
): RayuelaChildChoice => {
  const fragment = query.trim().toLowerCase()
  const matches = children.filter((child) => {
    const choice = choicesByNia?.get(child.id)
    return (
      child.id === query ||
      choice?.id === query ||
      child.name.toLowerCase().includes(fragment) ||
      choice?.name.toLowerCase().includes(fragment)
    )
  })
  if (query.trim() && matches.length === 1 && matches[0]) return matches[0]
  throw new Error(
    `Rayuela child is unknown or ambiguous; offered children: ${children.map((child) => `${child.id}: ${child.name}`).join('; ') || 'none (the current child is not listed)'}`,
  )
}
