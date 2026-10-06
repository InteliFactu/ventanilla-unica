/** The trimmed value of a mandatory CSV column or option; refuses a blank one. */
export const requireColumn = (
  row: Readonly<Record<string, string>>,
  column: string,
): string => {
  const value = (row[column] ?? '').trim()
  if (value === '') throw new Error(`modelo 190: ${column} is missing or empty`)
  return value
}
