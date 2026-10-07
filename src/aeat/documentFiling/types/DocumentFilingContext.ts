/** Whether the document filing is confirmed, and where its receipt is saved. */
export type DocumentFilingContext = {
  readonly confirmed: boolean
  readonly outDir?: string | undefined
}
