import { RAYUELA_MONTHS } from './RAYUELA_MONTHS'

/** Interpret a day-month label in the current year, or last year when ahead of today. */
export const resolveRayuelaDayMonthMs = (
  label: string,
  todayMs: number,
): number | undefined => {
  const match = /^(\d{1,2}) ([A-Z]{3})\.?$/.exec(label)
  const month = RAYUELA_MONTHS.indexOf(match?.[2] ?? '')
  if (match === null || month < 0) return undefined
  const day = Number(match[1])
  const year = new Date(todayMs).getUTCFullYear()
  const thisYear = Date.UTC(year, month, day)
  const candidate =
    thisYear > todayMs ? Date.UTC(year - 1, month, day) : thisYear
  return new Date(candidate).getUTCDate() === day ? candidate : undefined
}
