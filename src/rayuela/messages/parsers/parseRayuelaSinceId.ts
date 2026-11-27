/** A decimal message id, converted without losing precision. */
export const parseRayuelaSinceId = (
  value: string | undefined,
): bigint | undefined => {
  if (value === undefined) return undefined
  if (!/^\d+$/.test(value))
    throw new Error('--desde-id must be a numeric message id')
  return BigInt(value)
}
