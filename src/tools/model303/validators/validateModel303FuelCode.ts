import type { Model303Envelope } from '../types/Model303Envelope'
import { isModel303FuelPeriod } from './isModel303FuelPeriod'

/** The 2026 fuel flag follows DP30301 notes 5, 8 and 9. */
export const validateModel303FuelCode = (
  text: string,
  { ejercicio, periodo }: Model303Envelope,
): readonly string[] => {
  if (ejercicio !== '2026') return []
  const allowed =
    text.charAt(108) === '1' ? '2' : isModel303FuelPeriod(periodo) ? '12' : '0'
  return allowed.includes(text.charAt(129))
    ? []
    : [
        'position 130: invalid fuel advance flag for the declaration period or regime',
      ]
}
