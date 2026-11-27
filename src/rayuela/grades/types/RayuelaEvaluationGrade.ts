export type RayuelaEvaluationGrade = {
  /** Column heading as shown, e.g. `1ª EVAL. PRIMARIA` or `Ordinaria`. */
  readonly evaluation: string
  /** Empty while the evaluation has no published grade. */
  readonly grade: string
}
