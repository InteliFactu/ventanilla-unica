import { readRayuelaCells } from '../../session/parsers/readRayuelaCells'
import { readRayuelaTodayMs } from '../dates/readRayuelaTodayMs'
import { resolveRayuelaMessageDate } from '../dates/resolveRayuelaMessageDate'
import type { RayuelaMessage } from '../types/RayuelaMessage'
import { parseRayuelaMessagePreview } from './parseRayuelaMessagePreview'
import { readRayuelaAttachmentFlag } from './readRayuelaAttachmentFlag'
/** Read only the embedded preview; opening the message would mark it read. */
export const parseRayuelaMessage = (
  row: string,
  id: string,
  todayMs: number | null = readRayuelaTodayMs(new Date()),
): RayuelaMessage => {
  const cells = readRayuelaCells(row)
  const dateText = cells.at(-1) ?? ''
  return {
    id,
    from: cells.at(-3) ?? '',
    ...parseRayuelaMessagePreview(row),
    dateText,
    date: resolveRayuelaMessageDate(dateText, todayMs),
    hasAttachments: readRayuelaAttachmentFlag(row),
  }
}
