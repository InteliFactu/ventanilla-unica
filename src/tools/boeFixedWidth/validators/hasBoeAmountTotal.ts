import { readBoeAmount } from './readBoeAmount'

/** Reconcile a fixed-width cents total without floating-point rounding. */
export const hasBoeAmountTotal = (
  header: string,
  details: readonly string[],
  signed = true,
): boolean => {
  const sum = details.reduce((total, field) => total + readBoeAmount(field), 0n)
  if (!signed)
    return sum >= 0n && header === String(sum).padStart(header.length, '0')
  const sign = sum < 0n ? 'N' : ' '
  const magnitude = sum < 0n ? -sum : sum
  return header === sign + String(magnitude).padStart(header.length - 1, '0')
}
