import { normalizeLabel } from '../../../html/mappers/normalizeLabel'
import { resolveRayuelaDateMs } from './resolveRayuelaDateMs'
import { resolveRayuelaExplicitDateMs } from './resolveRayuelaExplicitDateMs'

/** Infer the ISO date from a known Rayuela list label. */
export const resolveRayuelaMessageDate = (
  dateText: string,
  todayMs: number | null,
): string | null => {
  const label = normalizeLabel(dateText)
  const dateMs =
    resolveRayuelaExplicitDateMs(label) ??
    (todayMs === null ? undefined : resolveRayuelaDateMs(label, todayMs))
  return dateMs === undefined
    ? null
    : new Date(dateMs).toISOString().slice(0, 10)
}
