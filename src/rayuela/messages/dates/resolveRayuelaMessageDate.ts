import { normalizeLabel } from '../../../html/mappers/normalizeLabel'
import { resolveRayuelaDateMs } from './resolveRayuelaDateMs'

/** Infer the ISO date from a known Rayuela list label. */
export const resolveRayuelaMessageDate = (
  dateText: string,
  todayMs: number,
): string | null => {
  const dateMs = resolveRayuelaDateMs(normalizeLabel(dateText), todayMs)
  return dateMs === undefined
    ? null
    : new Date(dateMs).toISOString().slice(0, 10)
}
