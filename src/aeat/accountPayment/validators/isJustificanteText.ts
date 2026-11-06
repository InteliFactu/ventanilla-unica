/** Thirteen upper-case letters or digits, the shape of the form's idjus field (maxlength 13). */
export const isJustificanteText = (text: string): boolean =>
  /^[0-9A-Z]{13}$/.test(text)
