/** A presented informative return: its CSV and, with --out, the justificante. */
export type BulkFilingReceipt = {
  readonly csv: string
  readonly justificantePath?: string | undefined
}
