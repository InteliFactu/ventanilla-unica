/** Decode integer cents from a structurally validated BOE amount field. */
export const readBoeAmount = (field: string): bigint => {
  const match = /^([ N]?)(\d+)$/.exec(field)
  const digits = match?.[2]
  if (digits === undefined) return 0n
  return BigInt(digits) * (match?.[1] === 'N' ? -1n : 1n)
}
