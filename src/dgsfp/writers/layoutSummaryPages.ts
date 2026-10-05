import type { DgsfpDrawText } from '../types/DgsfpDrawText'
import type { DgsfpSummaryLine } from '../types/DgsfpSummaryLine'
import { wrapLine } from './wrapLine'

/**
 * Flow the document's lines over A4 pages below the header and above the
 * footer band, which also keeps page 1's signature stamp area clear.
 */
export const layoutSummaryPages = (
  lines: readonly DgsfpSummaryLine[],
): readonly (readonly DgsfpDrawText[])[] => {
  const top = 740
  const bottom = 110
  const left = 50
  const usable = 495
  const styles = {
    title: { size: 12, bold: true, indent: 0, before: 0, em: 0.6 },
    section: { size: 10, bold: true, indent: 0, before: 8, em: 0.7 },
    label: { size: 9, bold: true, indent: 6, before: 3, em: 0.6 },
    value: { size: 9, bold: false, indent: 16, before: 0, em: 0.55 },
  } as const
  const pages: DgsfpDrawText[][] = [[]]
  let y = top
  for (const line of lines) {
    const style = styles[line.style]
    const width = Math.floor((usable - style.indent) / (style.size * style.em))
    y -= style.before
    for (const text of wrapLine(line.text, width)) {
      if (y - style.size < bottom) {
        pages.push([])
        y = top
      }
      y -= style.size * 1.4
      pages.at(-1)?.push({
        x: left + style.indent,
        y,
        size: style.size,
        bold: style.bold,
        text,
      })
    }
  }
  return pages
}
