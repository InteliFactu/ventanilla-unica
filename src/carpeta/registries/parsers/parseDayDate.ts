/** Validate `dd/mm/aaaa` and encode the calendar day at UTC midnight. */
export const parseDayDate = (text: string, option: string): Date => {
  const [, day, month, year] = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text) ?? []
  const iso = `${String(year)}-${String(month)}-${String(day)}T00:00:00.000Z`
  const date = new Date(iso)
  if (!Number.isFinite(date.getTime()) || date.toISOString() !== iso)
    throw new Error(`--${option} must be a dd/mm/aaaa date, not "${text}"`)
  return date
}
