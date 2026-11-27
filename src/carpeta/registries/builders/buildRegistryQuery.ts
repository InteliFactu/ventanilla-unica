import type { CliOptions } from '../../../cli/types/CliOptions'
import { mapRegistryMadridDayEnd } from '../mappers/mapRegistryMadridDayEnd'
import { mapRegistryMadridDayStart } from '../mappers/mapRegistryMadridDayStart'
import { parseDayDate } from '../parsers/parseDayDate'
import { registryDefaultDays } from '../registryDefaultDays'
import type { RegistryQuery } from '../types/RegistryQuery'

/**
 * The `carpeta registros` query from `--desde`, `--hasta` (dd/mm/aaaa) and
 * `--registro`. Like the front, it defaults to the last 30 days ending now;
 * explicit bounds use the Madrid calendar and `--hasta` includes the whole
 * of that day. A REGAGE number is only found
 * when the range covers its registration date.
 */
export const buildRegistryQuery = (
  options: CliOptions,
  now: Date,
): RegistryQuery => {
  const desde = options['desde']
  const hasta = options['hasta']
  const number = options['registro']?.trim()
  if (number === '')
    throw new Error('--registro must be a nonempty registry number')
  const from = desde
    ? mapRegistryMadridDayStart(parseDayDate(desde, 'desde'))
    : new Date(now.getTime() - registryDefaultDays * 24 * 60 * 60 * 1000)
  const to = hasta ? mapRegistryMadridDayEnd(parseDayDate(hasta, 'hasta')) : now
  if (from > to) throw new Error('--desde must not be after --hasta')
  return { from, to, number }
}
