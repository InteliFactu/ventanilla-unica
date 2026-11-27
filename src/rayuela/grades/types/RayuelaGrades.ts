import type { RayuelaSubjectGrades } from './RayuelaSubjectGrades'

export type RayuelaGrades = {
  /** Selected academic year, e.g. `2025-2026`. */
  readonly academicYear: string
  /** Every academic year the portal offers for this child, as `--curso` values. */
  readonly academicYears: readonly string[]
  readonly centre: string
  readonly course: string
  /** Empty until the end-of-year promotion decision is published. */
  readonly promotion: string
  /** Empty when the portal reports "No existen datos". */
  readonly subjects: readonly RayuelaSubjectGrades[]
}
