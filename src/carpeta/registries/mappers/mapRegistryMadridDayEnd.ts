import { mapRegistryMadridDayStart } from './mapRegistryMadridDayStart'

/** The last millisecond of the Madrid calendar day, including DST changes. */
export const mapRegistryMadridDayEnd = (day: Date): Date => {
  const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000)
  return new Date(mapRegistryMadridDayStart(nextDay).getTime() - 1)
}
