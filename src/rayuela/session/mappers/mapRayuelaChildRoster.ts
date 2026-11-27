import type { RayuelaChild } from '../../children/types/RayuelaChild'
import { normalizeRayuelaName } from '../selectors/normalizeRayuelaName'
import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'

/** Reduce the account roster to the identities required by child selection. */
export const mapRayuelaChildRoster = (
  roster: readonly RayuelaChild[],
): RayuelaChildChoice[] => {
  const children = roster.map((child) => ({ id: child.nia, name: child.name }))
  if (
    children.some(
      (child) => !child.id.trim() || !normalizeRayuelaName(child.name),
    ) ||
    new Set(children.map((child) => child.id)).size !== children.length
  )
    throw new Error('Rayuela returned an incomplete or duplicate child roster')
  return children
}
