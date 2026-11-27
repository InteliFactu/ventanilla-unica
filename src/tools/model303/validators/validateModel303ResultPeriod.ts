import type { Model303Envelope } from '../types/Model303Envelope'
import { isModel303FuelPeriod } from './isModel303FuelPeriod'

/** Box 112 is reserved for monthly periods from February 2026 onward. */
export const validateModel303ResultPeriod = (
  text: string,
  { ejercicio, periodo }: Model303Envelope,
): readonly string[] =>
  ejercicio === '2026' &&
  !isModel303FuelPeriod(periodo) &&
  /[1-9]/.test(text.slice(390, 407))
    ? ['box 112 is unavailable in this period']
    : []
