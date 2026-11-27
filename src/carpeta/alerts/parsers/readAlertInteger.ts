/** Read the integer forms of group levels and day counts used by the portal. */
export const readAlertInteger = (value: unknown): number | null => {
  const amount =
    typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  return typeof amount === 'number' &&
    Number.isSafeInteger(amount) &&
    amount >= 0
    ? amount
    : null
}
