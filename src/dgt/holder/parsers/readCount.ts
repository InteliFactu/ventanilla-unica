/** A counter value as the DGT writes it ("3" or 0), or undefined for anything that is not a whole number ("-", HTML). */
export const readCount = (value: unknown): number | undefined => {
  const count = typeof value === 'string' ? Number(value) : value
  return typeof count === 'number' && Number.isInteger(count) && value !== ''
    ? count
    : undefined
}
