import { htmlToText } from '../../../html/htmlToText'
import type { AeatPower } from '../types/AeatPower'

/**
 * Every `filaNum` row of the list, each cell under the label of its column.
 * The row markup is the AEAT query framework's (`query4.js`), the same as the
 * GNNO-JDIT notification list; the holders read so far have no apoderamiento,
 * so it has not been seen filled on this page.
 */
export const parsePowerRows = (
  html: string,
  columns: readonly string[],
): readonly AeatPower[] => {
  const rowPattern = /<tr\s[^>]*id=['"]filaNum\d+['"][^>]*>([\s\S]*?)<\/tr>/gi
  const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi
  return [...html.matchAll(rowPattern)].map(([, inner = '']) => {
    const cells = [...inner.matchAll(cellPattern)].map(([, cell = '']) =>
      htmlToText(cell),
    )
    return Object.fromEntries(
      columns.map((label, index) => [label, cells[index] ?? '']),
    )
  })
}
