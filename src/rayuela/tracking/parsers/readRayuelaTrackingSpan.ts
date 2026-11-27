import { htmlToText } from '../../../html/htmlToText'
import type { RayuelaTrackingSpan } from '../types/RayuelaTrackingSpan'

/** Extract a table cell's displayed text and the height of its covered rows. */
export const readRayuelaTrackingSpan = (
  cell: RegExpMatchArray,
): RayuelaTrackingSpan => {
  const attributes = cell[1] ?? ''
  const span = /\srowspan\s*=\s*["']?(\d+)/i.exec(attributes)?.[1]
  const remaining = Number(span ?? '1')
  const colspan = /\scolspan\s*=\s*["']?(\d+)/i.exec(attributes)?.[1]
  if (
    !Number.isSafeInteger(remaining) ||
    remaining < 1 ||
    Number(colspan ?? '1') !== 1
  )
    throw new Error('Rayuela tracking table contains an unsupported cell span')
  return { value: htmlToText(cell[2] ?? ''), remaining }
}
