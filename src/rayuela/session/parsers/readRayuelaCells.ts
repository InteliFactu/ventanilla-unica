import { htmlToText } from '../../../html/htmlToText'
/** Read cells without executing any links or inline handlers. */
export const readRayuelaCells = (row: string): string[] =>
  Array.from(row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi), (match) =>
    htmlToText(match[1] ?? ''),
  )
