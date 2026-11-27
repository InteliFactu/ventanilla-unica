import { htmlToText } from '../../../html/htmlToText'
import { readRayuelaTodayMs } from '../dates/readRayuelaTodayMs'
import type { RayuelaMessages } from '../types/RayuelaMessages'
import { assertRayuelaMessagePage } from '../validators/assertRayuelaMessagePage'
import { parseRayuelaMessage } from './parseRayuelaMessage'
/** Parse the selected tray page and include the portal total. */
export const parseRayuelaMessages = (
  html: string,
  todayMs: number | null = readRayuelaTodayMs(new Date()),
  offset = 0,
): RayuelaMessages => {
  const range = /Registros:\s*(?:(\d+)\s*-\s*(\d+)\s+de\s+)?(\d+)/i.exec(
    htmlToText(html),
  )
  if (range === null) throw new Error('Rayuela message total was not found')
  const rows = Array.from(
    html.matchAll(/<tr\s[^>]*id=["'](\d+)["'][^>]*>([\s\S]*?)<\/tr>/gi),
  )
  if (offset > 0) assertRayuelaMessagePage(offset, range, rows.length)
  return {
    messages: rows.map((match) =>
      parseRayuelaMessage(match[2] ?? '', match[1] ?? '', todayMs),
    ),
    total: Number(range[3]),
    notes: [
      'Only the selected page is shown; message bodies may be truncated.',
      'No message was opened or marked as read.',
    ],
  }
}
