/** What the signed post answered: whether it was filed, its registro and expediente, and a summary. */
export type FilingAnswer = {
  readonly filed: boolean
  readonly registro: string | undefined
  readonly expediente: string | undefined
  readonly summary: string
}
