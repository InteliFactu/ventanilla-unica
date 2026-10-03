/** What filing a ROLECE application answered, and the files kept of it. */
export type RegistrationReceipt = {
  /** True when the answer is the acuse de recibo; false means the page was saved for a human to read. */
  readonly filed: boolean
  /** The expediente number the acuse de recibo shows, when it names one. */
  readonly expediente: string | undefined
  /** The page's own words, tags stripped, at most a few hundred characters. */
  readonly summary: string
  /** Every file written under `--out`. */
  readonly files: readonly string[]
}
