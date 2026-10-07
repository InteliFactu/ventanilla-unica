import type { RealizedMonthRange } from './types/RealizedMonthRange'

/**
 * The `dd/mm/yyyy` first and last day of one calendar month, as DEHU's
 * realized-notifications filter expects. The API rejects any window wider
 * than a month, so a year is always swept one of these at a time.
 */
export const realizedMonthWindow = (
  year: number,
  month: number,
): RealizedMonthRange => {
  const pad = (value: number): string => String(value).padStart(2, '0')
  const lastDay = new Date(year, month, 0).getDate()
  return {
    from: `01/${pad(month)}/${String(year)}`,
    to: `${pad(lastDay)}/${pad(month)}/${String(year)}`,
  }
}
