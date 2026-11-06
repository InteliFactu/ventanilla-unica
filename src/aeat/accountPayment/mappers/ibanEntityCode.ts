/** The four-digit bank entity code of a Spanish IBAN (positions 5-8). */
export const ibanEntityCode = (iban: string): string => iban.slice(4, 8)
