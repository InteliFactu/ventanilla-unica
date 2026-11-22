/** What the form printed after filing, and where its raw answers were kept. */
export type SelfAssessmentReceipt = {
  readonly labels: readonly string[]
  readonly urls: readonly string[]
  readonly answersPath?: string | undefined
}
