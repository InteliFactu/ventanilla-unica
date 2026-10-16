/** One company row of the mercantil search. */
export type NotaCompany = {
  /** The opaque id the search posts back to select the row. */
  readonly documentId: string
  readonly name: string
  readonly nif: string
  readonly irus: string
  readonly registry: string
  readonly status: string
}
