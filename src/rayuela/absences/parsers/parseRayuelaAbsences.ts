import { readRayuelaRows } from '../../session/parsers/readRayuelaRows'
import { readRayuelaTables } from '../../session/parsers/readRayuelaTables'
import type { RayuelaAbsence } from '../types/RayuelaAbsence'
/** Read absences without notifying or justifying them. */
export const parseRayuelaAbsences = (html: string): RayuelaAbsence[] => {
  const table = readRayuelaTables(html).find((item) =>
    item.includes('Ausencia en'),
  )
  // A child without absences gets no table, only this notice.
  if (
    !table &&
    html.includes('falta de asistencia:') &&
    html.includes('<H3>No existen datos</H3>')
  )
    return []
  if (!table) throw new Error('Rayuela absences table was not found')
  return readRayuelaRows(table)
    .filter((row) => row.length === 5)
    .map((row) => ({
      date: row[0] ?? '',
      absenceIn: row[1] ?? '',
      late: row[2] ?? '',
      reason: row[3] ?? '',
      notified: row[4] ?? '',
    }))
}
