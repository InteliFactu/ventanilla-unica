import { htmlToText } from '../../../html/htmlToText'

/** Every `<tr>` on a page, reduced to the plain text of its `<td>`/`<th>` cells. */
export const parseTableRowCells = (
  html: string,
): readonly (readonly string[])[] =>
  [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi)].map(([, inner = '']) =>
    [...inner.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]\s*>/gi)].map(
      ([, cell = '']) => htmlToText(cell),
    ),
  )
