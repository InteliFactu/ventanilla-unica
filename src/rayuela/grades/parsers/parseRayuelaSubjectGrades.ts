import type { RayuelaSubjectGrades } from '../types/RayuelaSubjectGrades'
/** Map one grades row onto the evaluation headings after Materia and Tipo. */
export const parseRayuelaSubjectGrades = (
  row: readonly string[],
  evaluations: readonly string[],
): RayuelaSubjectGrades => ({
  subject: row[0] ?? '',
  type: row[1] ?? '',
  grades: evaluations.map((evaluation, index) => ({
    evaluation,
    grade: row[index + 2] ?? '',
  })),
})
