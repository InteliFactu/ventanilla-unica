/** A fixed-width numeric field: right aligned and zero padded; refuses a value that does not fit. */
export const numberField = (value: number | string, length: number): string => {
  const digits = String(value)
  if (!/^\d+$/.test(digits) || digits.length > length)
    throw new Error(
      `modelo 190: ${digits} is not a ${String(length)}-digit number`,
    )
  return digits.padStart(length, '0')
}
