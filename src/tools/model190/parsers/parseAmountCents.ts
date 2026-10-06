/**
 * "1396.58", "1396,58" or "1.396,58" -> 139658. With a comma the comma is the
 * decimal mark and dots are thousands; without one a dot is the decimal mark.
 */
export const parseAmountCents = (value: string, column: string): number => {
  const text = value.trim() === '' ? '0' : value.trim()
  const normalized = text.includes(',')
    ? text.replace(/\./g, '').replace(',', '.')
    : text
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized))
    throw new Error(`modelo 190: ${column} "${value}" is not an amount`)
  const [whole = '0', decimals = ''] = normalized.split('.')
  return Number(whole) * 100 + Number(decimals.padEnd(2, '0'))
}
