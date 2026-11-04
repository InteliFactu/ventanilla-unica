import { htmlToText } from '../../../html/htmlToText'
import { readAttribute } from '../../../html/readAttribute'

export const readYouthGuaranteeLabel = (html: string, id: string): string => {
  const labels = [...html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi)]
  return labels
    .filter(([, tag = '']) => readAttribute(tag, 'for') === id)
    .map(([, , text = '']) => htmlToText(text))
    .join(' ')
}
