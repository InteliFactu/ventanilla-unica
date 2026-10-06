/** A fixed-width alphanumeric field: left aligned and blank padded; refuses a value that does not fit. */
export const alphaField = (value: string, length: number): string => {
  if (value.length > length)
    throw new Error(
      `modelo 190: "${value}" does not fit a ${String(length)}-character field`,
    )
  return value.padEnd(length, ' ')
}
