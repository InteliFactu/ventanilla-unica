import { htmlToText } from '../../../html/htmlToText'

/** The column labels of the list, in order, from its show/hide checkboxes (`CKBcolumna_nN`), which the page prints even when nothing matched. */
export const parsePowerColumns = (html: string): readonly string[] => {
  const pattern =
    /<label\s+for=['"]CKBcolumna_n\d+['"][^>]*>([\s\S]*?)<\/label>/gi
  return [...html.matchAll(pattern)].map(([, label = '']) => htmlToText(label))
}
