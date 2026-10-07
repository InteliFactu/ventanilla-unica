import { htmlToText } from '../../../html/htmlToText'
import type { AeatExpedienteAct } from '../types/AeatExpedienteAct'

/** Parse one dated history link without requesting its target. */
export const parseExpedienteAct = (
  item: string,
): AeatExpedienteAct | undefined => {
  const date = /\b(\d{2})-(\d{2})-(\d{4})\b/.exec(item)
  const link = /<a[^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/i.exec(item)
  if (!date || !link) return undefined
  return {
    date: `${date[3] ?? ''}-${date[2] ?? ''}-${date[1] ?? ''}`,
    description: htmlToText(link[2] ?? ''),
    url: link[1]?.trim(),
  }
}
