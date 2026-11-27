import type { RayuelaTrackingSpan } from '../types/RayuelaTrackingSpan'
import { readRayuelaTrackingSpan } from './readRayuelaTrackingSpan'

/** Reuse the group's cells on each row covered by their rowspan. */
export const expandRayuelaTrackingRow = (
  row: string,
  width: number,
  spans: Map<number, RayuelaTrackingSpan>,
): string[] => {
  const cells = Array.from(
    row.matchAll(/<td\b([^>]*)>([\s\S]*?)<\/td>/gi),
    readRayuelaTrackingSpan,
  )
  let index = 0
  const expanded = Array.from({ length: width }, (_, column) => {
    const cell = spans.get(column) ?? cells[index++]
    if (cell === undefined)
      throw new Error('Rayuela tracking row is missing cells')
    const { value, remaining } = cell
    if (remaining > 1) spans.set(column, { value, remaining: remaining - 1 })
    else spans.delete(column)
    return value
  })
  if (index !== cells.length)
    throw new Error('Rayuela tracking row has unexpected cells')
  return expanded
}
