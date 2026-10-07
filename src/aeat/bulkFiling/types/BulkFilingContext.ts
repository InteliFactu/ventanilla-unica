/** Whether the informative filing is confirmed, and where its justificante is saved. */
export type BulkFilingContext = {
  readonly confirmed: boolean
  readonly outDir?: string | undefined
}
