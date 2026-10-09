/** What the sede answered to TramitaJustif, and where the files were saved. */
export type RelecReceipt = {
  /** CSV (`CUD`) of the justificante, verifiable at `/sta/Utils/DocumentCheck`. */
  readonly csv: string
  /** The filer NIF the sede pairs with the CSV (the represented entity's, without control digit). */
  readonly nif: string
  /** Only when the result page names it; the justificante PDF always does. */
  readonly registryNumber?: string | undefined
  /** The sede clock when it rendered the result page. */
  readonly answeredAt?: string | undefined
  readonly justificanteUrl: string
  readonly justificante?: string | undefined
  readonly output?: string | undefined
}
