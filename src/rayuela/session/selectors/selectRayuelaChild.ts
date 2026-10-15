import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'
/** Refuse ambiguous fragments instead of silently picking a child. */
export const selectRayuelaChild = (
  children: readonly RayuelaChildChoice[],
  query: string,
): RayuelaChildChoice => {
  const matches = children.filter(
    (child) =>
      child.id === query ||
      child.name.toLowerCase().includes(query.trim().toLowerCase()),
  )
  if (query.trim() && matches.length === 1 && matches[0]) return matches[0]
  throw new Error(
    `Rayuela child is unknown or ambiguous; offered children: ${children.map((child) => `${child.id}: ${child.name}`).join('; ') || 'none (the current child is not listed)'}`,
  )
}
