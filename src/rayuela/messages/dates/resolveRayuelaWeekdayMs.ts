import { RAYUELA_DAY_MS } from './RAYUELA_DAY_MS'
import { RAYUELA_WEEKDAYS } from './RAYUELA_WEEKDAYS'

/** The latest occurrence of the named weekday strictly before today. */
export const resolveRayuelaWeekdayMs = (
  label: string,
  todayMs: number,
): number | undefined => {
  const weekday = RAYUELA_WEEKDAYS.indexOf(label)
  if (weekday < 0) return undefined
  const daysBack = ((new Date(todayMs).getUTCDay() - weekday + 6) % 7) + 1
  return todayMs - daysBack * RAYUELA_DAY_MS
}
