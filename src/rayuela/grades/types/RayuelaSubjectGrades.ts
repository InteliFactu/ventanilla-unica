import type { RayuelaEvaluationGrade } from './RayuelaEvaluationGrade'

export type RayuelaSubjectGrades = {
  readonly subject: string
  readonly type: string
  readonly grades: readonly RayuelaEvaluationGrade[]
}
