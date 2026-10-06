/** 492210 -> "4922.10", for the summary a person reads. */
export const centsToEuros = (cents: number): string =>
  `${String(Math.trunc(cents / 100))}.${String(cents % 100).padStart(2, '0')}`
