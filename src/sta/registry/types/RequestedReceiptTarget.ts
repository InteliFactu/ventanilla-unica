/** For whom a justificante would be fetched, and where to save it if `--out` was given. */
export type RequestedReceiptTarget = {
  readonly nif: string
  readonly outDir?: string | undefined
}
