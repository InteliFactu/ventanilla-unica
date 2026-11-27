/** Check a normalized MisPagos date without accepting rollover into another month. */
export const isMisPagosCalendarDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.valueOf()) && date.toISOString().startsWith(value)
}
