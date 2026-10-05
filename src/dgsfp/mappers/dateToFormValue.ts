/**
 * A `YYYY-MM-DD` date as the date control stores it. The control shifts the
 * picked local midnight by the time-zone offset before `toISOString()`, so
 * the stored value is that day's UTC midnight whatever the browser's zone.
 */
export const dateToFormValue = (day: string): string => `${day}T00:00:00.000Z`
