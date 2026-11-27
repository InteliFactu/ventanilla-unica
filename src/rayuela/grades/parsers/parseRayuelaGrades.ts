import { htmlToText } from '../../../html/htmlToText'
import { readRayuelaCells } from '../../session/parsers/readRayuelaCells'
import { readRayuelaFields } from '../../session/parsers/readRayuelaFields'
import { readRayuelaRows } from '../../session/parsers/readRayuelaRows'
import { readRayuelaTables } from '../../session/parsers/readRayuelaTables'
import type { RayuelaGrades } from '../types/RayuelaGrades'
import { parseRayuelaSubjectGrades } from './parseRayuelaSubjectGrades'
import { readRayuelaOptions } from './readRayuelaOptions'
import { readRayuelaSelectedLabel } from './readRayuelaSelectedLabel'
import { requireRayuelaGradeYear } from './requireRayuelaGradeYear'
/** Read the Calificaciones page; an empty year yields no subjects. */
export const parseRayuelaGrades = (
  html: string,
  expectedYear?: string,
): RayuelaGrades => {
  const years = readRayuelaOptions(html, 'C_ANNO')
  const selectedYear = requireRayuelaGradeYear(years, expectedYear)
  const table = readRayuelaTables(html).find((item) => item.includes('Materia'))
  if (!table && !htmlToText(html).includes('No existen datos'))
    throw new Error('Rayuela grades table was not found')
  const header = /<tr\b[^>]*>([\s\S]*?)<\/tr>/i.exec(table ?? '')?.[1] ?? ''
  const evaluations = readRayuelaCells(header).slice(2)
  return {
    academicYear: selectedYear.label,
    academicYears: years.map((year) => year.label),
    centre: readRayuelaSelectedLabel(html, 'X_CENTRO'),
    course: readRayuelaSelectedLabel(html, 'X_OFERTAMATRIG'),
    promotion: htmlToText(
      readRayuelaFields(html).get('Resultado de la promoción') ?? '',
    ),
    subjects: readRayuelaRows(table ?? '').map((row) =>
      parseRayuelaSubjectGrades(row, evaluations),
    ),
  }
}
