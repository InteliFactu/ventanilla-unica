import { htmlToText } from '../../../html/htmlToText'

/**
 * The value printed after `<strong>Label: </strong>` on the avisos detail
 * page, which sits in the next `<span>`; null when the label is absent.
 */
export const readLabelledSpan = (
  html: string,
  label: string,
): string | null => {
  const start = html.indexOf(`${label}:`)
  if (start === -1) return null
  const match = /<span[^>]*>([\s\S]*?)<\/span>/.exec(html.slice(start))
  const value = match ? htmlToText(match[1] ?? '') : ''
  return value === '' ? null : value
}
