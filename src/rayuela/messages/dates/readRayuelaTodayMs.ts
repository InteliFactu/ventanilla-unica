/** UTC midnight encoding Rayuela's Madrid calendar day at the given instant. */
export const readRayuelaTodayMs = (instant: Date): number => {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(instant)
  const fields = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  )
  return Date.UTC(
    Number(fields['year']),
    Number(fields['month']) - 1,
    Number(fields['day']),
  )
}
