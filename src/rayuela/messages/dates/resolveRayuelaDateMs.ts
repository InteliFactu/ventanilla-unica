import { isRayuelaClockTime } from './isRayuelaClockTime'
import { RAYUELA_DAY_MS } from './RAYUELA_DAY_MS'
import { resolveRayuelaDayMonthMs } from './resolveRayuelaDayMonthMs'
import { resolveRayuelaWeekdayMs } from './resolveRayuelaWeekdayMs'

/** Interpret clock labels as today and infer dates for known relative labels. */
export const resolveRayuelaDateMs = (
  label: string,
  todayMs: number,
): number | undefined => {
  if (label === 'HOY' || isRayuelaClockTime(label)) return todayMs
  if (label === 'AYER') return todayMs - RAYUELA_DAY_MS
  return (
    resolveRayuelaWeekdayMs(label, todayMs) ??
    resolveRayuelaDayMonthMs(label, todayMs)
  )
}
