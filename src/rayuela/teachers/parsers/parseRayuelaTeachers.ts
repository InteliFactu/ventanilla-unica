import { htmlToText } from '../../../html/htmlToText'
import { readRayuelaFields } from '../../session/parsers/readRayuelaFields'
import { readRayuelaRows } from '../../session/parsers/readRayuelaRows'
import { readRayuelaTables } from '../../session/parsers/readRayuelaTables'
import type { RayuelaTeachers } from '../types/RayuelaTeachers'
/** Read the group, tutor and teaching staff displayed by the portal. */
export const parseRayuelaTeachers = (html: string): RayuelaTeachers => {
  const fields = readRayuelaFields(html)
  const table = readRayuelaTables(html).find((item) =>
    item.includes('Materia-Actividad'),
  )
  if (!table) throw new Error('Rayuela teachers table was not found')
  return {
    group: htmlToText(fields.get('Grupo') ?? ''),
    tutor: htmlToText(fields.get('Tutor/a') ?? ''),
    teachers: readRayuelaRows(table)
      .filter((row) => row.length === 3)
      .map((row) => ({
        subject: row[0] ?? '',
        teacher: row[1] ?? '',
        visitingHours: row[2] ?? '',
      })),
  }
}
