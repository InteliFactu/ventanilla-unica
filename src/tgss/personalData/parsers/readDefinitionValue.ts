import { htmlToText } from '../../../html/htmlToText'

/** The text of the `<dd>` that follows the `<dt>` whose text matches `label`, or an empty string. */
export const readDefinitionValue = (html: string, label: RegExp): string => {
  for (const match of html.matchAll(
    /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi,
  )) {
    const [, term = '', value = ''] = match
    if (label.test(htmlToText(term))) return htmlToText(value)
  }
  return ''
}
