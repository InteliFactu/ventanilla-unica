import { cccControlDigit } from '../mappers/cccControlDigit'

/**
 * The two CCC control digits inside a Spanish IBAN (positions 13-14): one over
 * entity and branch, one over the account number. The AEAT checks them and
 * answers "El campo banco tiene un formato erróneo" when they are wrong.
 */
export const hasValidCccDigits = (iban: string): boolean => {
  const bankBranch = `00${iban.slice(4, 12)}`
  const account = iban.slice(14, 24)
  return (
    iban.slice(12, 14) ===
    `${String(cccControlDigit(bankBranch))}${String(cccControlDigit(account))}`
  )
}
