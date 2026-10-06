import { requireColumn } from './requireColumn'

/** A mandatory column that must hold exactly `length` digits (year of birth, province, contract). */
export const readDigitsColumn = (
  row: Readonly<Record<string, string>>,
  column: string,
  length: number,
): string => {
  const value = requireColumn(row, column)
  if (value.length !== length || !/^\d+$/.test(value))
    throw new Error(
      `modelo 190: ${column} "${value}" must be ${String(length)} digits`,
    )
  return value
}
