/** Convert a UTC-encoded civil date into the instant of midnight in Madrid. */
export const mapRegistryMadridDayStart = (day: Date): Date => {
  const offset = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'longOffset',
  })
    .formatToParts(day)
    .find(({ type }) => type === 'timeZoneName')?.value
  if (offset === 'GMT') return day
  const [, sign, hours, minutes, seconds = '0'] =
    /^GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(offset ?? '') ?? []
  if (hours === undefined || minutes === undefined)
    throw new Error('Carpeta: unable to resolve the Madrid day boundary')
  const offsetSeconds =
    Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
  return new Date(
    day.getTime() - offsetSeconds * 1000 * (sign === '-' ? -1 : 1),
  )
}
