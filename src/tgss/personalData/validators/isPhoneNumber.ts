/** A Spanish nine-digit phone number, mobile or landline, as the Importass modal takes it. */
export const isPhoneNumber = (value: string): boolean =>
  /^[6-9]\d{8}$/.test(value)
