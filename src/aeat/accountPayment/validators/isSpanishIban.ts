/** A normalized `ES` + 22 digits IBAN whose ISO 13616 mod-97 checksum holds. */
export const isSpanishIban = (iban: string): boolean => {
  if (!/^ES\d{22}$/.test(iban)) return false
  const spainDigits = '1428'
  const digits = `${iban.slice(4)}${spainDigits}${iban.slice(2, 4)}`
  let remainder = 0
  for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97
  return remainder === 1
}
