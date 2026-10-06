import { splitCsvLine } from './splitCsvLine'

/** CSV text with a header line -> one record per non-blank line, keyed by lower-case column name. */
export const readCsvRows = (
  text: string,
): ReadonlyArray<Readonly<Record<string, string>>> => {
  const [header = '', ...lines] = text
    .replace(/^\ufeff/u, '')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
  const columns = splitCsvLine(header).map((column) => column.toLowerCase())
  return lines.map((line) => {
    const values = splitCsvLine(line)
    return Object.fromEntries(
      columns.map((column, index): [string, string] => [
        column,
        values[index] ?? '',
      ]),
    )
  })
}
