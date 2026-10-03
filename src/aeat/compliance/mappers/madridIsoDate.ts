/** `YYYY-MM-DD` of an instant on the AEAT's own calendar (Europe/Madrid). */
export const madridIsoDate = (instant: Date): string =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(
    instant,
  )
