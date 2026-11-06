/** An IBAN as typed (spaces, hyphens, lower case) in the form the AEAT field takes. */
export const normalizeIban = (value: string): string =>
  value.replaceAll(/[\s-]/g, '').toUpperCase()
