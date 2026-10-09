/** One contribution to an open expediente: its number, the PDFs, their descriptions and an optional comment. */
export type StaContributionQuery = {
  /** AÑO/NUMERO, e.g. `2026/25777D`. */
  readonly expediente: string
  readonly documents: readonly string[]
  /** One per document, in order; a missing one is sent empty. */
  readonly descriptions: readonly string[]
  /** "Información adicional", optional. */
  readonly comment?: string | undefined
}
