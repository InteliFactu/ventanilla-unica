import { htmlToText } from '../../../html/htmlToText'
import { readRayuelaTodayMs } from '../dates/readRayuelaTodayMs'
import type { RayuelaMessages } from '../types/RayuelaMessages'
import { parseRayuelaMessage } from './parseRayuelaMessage'
/** Parse the first page of the selected tray, including the portal total. */
export const parseRayuelaMessages = (
  html: string,
  todayMs: number | null = readRayuelaTodayMs(new Date()),
): RayuelaMessages => {
  const total = /Registros:\s*(?:\d+\s*-\s*\d+\s+de\s+)?(\d+)/i.exec(
    htmlToText(html),
  )?.[1]
  if (total === undefined)
    throw new Error('Rayuela message total was not found')
  const rows = Array.from(
    html.matchAll(/<tr\s[^>]*id=["'](\d+)["'][^>]*>([\s\S]*?)<\/tr>/gi),
  )
  return {
    messages: rows.map((match) =>
      parseRayuelaMessage(match[2] ?? '', match[1] ?? '', todayMs),
    ),
    total: Number(total),
    notes: [
      'First page of the selected tray only; message bodies may be truncated.',
      'No message was opened or marked as read.',
    ],
  }
}
