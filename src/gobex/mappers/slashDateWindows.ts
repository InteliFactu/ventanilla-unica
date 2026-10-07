import { formatSlashDate } from '../formatters/formatSlashDate'
import type { GobexDateRange } from '../types/GobexDateRange'
import { parseSlashDate } from './parseSlashDate'

/**
 * `desde`..`hasta` (both `dd/mm/aaaa`, inclusive) cut into consecutive
 * windows of at most `days` days, oldest first.
 */
export const slashDateWindows = (
  desde: string,
  hasta: string,
  days: number,
): GobexDateRange[] => {
  const end = parseSlashDate(hasta)
  const windows: GobexDateRange[] = []
  for (
    let start = parseSlashDate(desde);
    start <= end;
    start = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + days,
    )
  ) {
    const last = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + days - 1,
    )
    windows.push({
      desde: formatSlashDate(start),
      hasta: formatSlashDate(last < end ? last : end),
    })
  }
  return windows
}
