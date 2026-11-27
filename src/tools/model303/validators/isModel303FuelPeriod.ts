/** Fuel advance fields of the 2026 design are available from February onward. */
export const isModel303FuelPeriod = (period: string): boolean =>
  /^(?:0[2-9]|1[0-2])$/.test(period)
