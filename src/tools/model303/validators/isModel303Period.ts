/** Monthly and quarterly periods published in the modelo 303 layout. */
export const isModel303Period = (period: string): boolean =>
  /^(?:0[1-9]|1[0-2]|[1-4]T)$/.test(period)
