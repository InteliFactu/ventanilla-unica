import { readRayuelaCells } from '../../session/parsers/readRayuelaCells'
import { readRayuelaTables } from '../../session/parsers/readRayuelaTables'
import type { RayuelaTrackingSpan } from '../types/RayuelaTrackingSpan'
import type { RayuelaTrackingTable } from '../types/RayuelaTrackingTable'
import { expandRayuelaTrackingRow } from './expandRayuelaTrackingRow'

/** Preserve the portal's column names and the subject or group of each row. */
export const parseRayuelaTrackingTable = (
  html: string,
): RayuelaTrackingTable => {
  const [table, unexpected] = readRayuelaTables(html)
  if (!table && /<h3\b[^>]*>\s*No existen datos\s*<\/h3>/i.test(html))
    return { columns: [], rows: [] }
  if (!table || unexpected)
    throw new Error(
      'Rayuela tracking data table was not found or was ambiguous',
    )
  const [header, ...body] = table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)
  const headerMarkup = header?.[1] ?? ''
  if (!/<th\b/i.test(headerMarkup))
    throw new Error('Rayuela tracking table headings were not found')
  const columns = readRayuelaCells(headerMarkup)
  const spans = new Map<number, RayuelaTrackingSpan>()
  const rows = body.map((row) =>
    expandRayuelaTrackingRow(row[1] ?? '', columns.length, spans),
  )
  if (spans.size > 0)
    throw new Error('Rayuela tracking group extends beyond the available rows')
  return { columns, rows }
}
