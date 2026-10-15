import { readRayuelaCells } from '../../session/parsers/readRayuelaCells'
import type { RayuelaMessage } from '../types/RayuelaMessage'
import { parseRayuelaMessagePreview } from './parseRayuelaMessagePreview'
import { readRayuelaAttachmentFlag } from './readRayuelaAttachmentFlag'
/** Read only the embedded preview; opening the message would mark it read. */
export const parseRayuelaMessage = (
  row: string,
  id: string,
): RayuelaMessage => {
  const cells = readRayuelaCells(row)
  return {
    id,
    from: cells.at(-3) ?? '',
    ...parseRayuelaMessagePreview(row),
    dateText: cells.at(-1) ?? '',
    hasAttachments: readRayuelaAttachmentFlag(row),
  }
}
