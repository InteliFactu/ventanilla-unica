/** Spanish IBAN syntax and ISO 13616 mod-97 validation, before any request or interpolation. */
export const validateThirdPartyIban = (value: string): string => {
  const iban = value.replace(/[ -]/g, '').toUpperCase()
  if (!/^ES\d{22}$/.test(iban))
    throw new Error('Junta: --iban must be a Spanish IBAN')
  const digits = `${iban.slice(4)}1428${iban.slice(2, 4)}`
  let remainder = 0
  for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97
  if (remainder !== 1) throw new Error('Junta: invalid IBAN checksum')
  return iban
}
