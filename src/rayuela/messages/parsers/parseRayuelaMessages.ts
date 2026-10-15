import { htmlToText } from '../../../html/htmlToText'
import type { RayuelaMessages } from '../types/RayuelaMessages'
import { parseRayuelaMessage } from './parseRayuelaMessage'
/** First inbox page only: previews may be truncated by the portal. */
export const parseRayuelaMessages = (html: string): RayuelaMessages => {
  const total = /Registros:\s*(?:\d+\s*-\s*\d+\s+de\s+)?(\d+)/i.exec(
    htmlToText(html),
  )?.[1]
  if (total === undefined) throw new Error('Rayuela inbox total was not found')
  const rows = Array.from(
    html.matchAll(/<tr\s[^>]*id=["'](\d+)["'][^>]*>([\s\S]*?)<\/tr>/gi),
  )
  return {
    messages: rows.map((match) =>
      parseRayuelaMessage(match[2] ?? '', match[1] ?? ''),
    ),
    total: Number(total),
    notes: [
      'First inbox page only; message bodies may be truncated.',
      'No message was opened or marked as read.',
    ],
  }
}
