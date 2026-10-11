import { htmlToText } from '../../../html/htmlToText'

/**
 * Mis datos censales prints each address as several `<table title=...>`
 * blocks, each a row of bold labels followed by a row of values. Join every
 * table carrying `title` into one label-to-value record, empty values left out.
 */
export const readTitledTables = (
  html: string,
  title: string,
): Record<string, string> => {
  const record: Record<string, string> = {}
  const tables = html.split(`title='${title}'`).slice(1)
  for (const table of tables) {
    const body = table.slice(table.indexOf('>') + 1).split('</table>')[0] ?? ''
    const rows = body.split(/<\/tr>/i)
    rows.forEach((row, index) => {
      if (!/<b>/i.test(row)) return
      const labels = row.split(/<\/td>/i).map(htmlToText)
      const values = (rows[index + 1] ?? '').split(/<\/td>/i).map(htmlToText)
      labels.forEach((label, cell) => {
        const value = values[cell] ?? ''
        if (label !== '' && value !== '') record[label] = value
      })
    })
  }
  return record
}
