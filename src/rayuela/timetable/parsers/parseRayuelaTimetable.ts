import { readRayuelaCells } from '../../session/parsers/readRayuelaCells'
import { readRayuelaRows } from '../../session/parsers/readRayuelaRows'
import { readRayuelaTables } from '../../session/parsers/readRayuelaTables'
import type { RayuelaTimetable } from '../types/RayuelaTimetable'
/** Preserve the displayed time and every weekday cell, plus abbreviation legend. */
export const parseRayuelaTimetable = (html: string): RayuelaTimetable => {
  const tables = readRayuelaTables(html)
  const table = tables.find((item) => item.includes('Lunes'))
  if (!table) throw new Error('Rayuela timetable was not found')
  return {
    days: readRayuelaCells(
      /<tr\b[^>]*>([\s\S]*?)<\/tr>/i.exec(table)?.[1] ?? '',
    ).slice(1),
    slots: readRayuelaRows(table),
    legend: tables
      .filter((item) => item !== table)
      .flatMap(readRayuelaRows)
      .filter((row) => row.length === 2),
  }
}
