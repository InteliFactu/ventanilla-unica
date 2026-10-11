/** The contact data to register at the DGT, validated and in the DGT's own format. */
export type DgtContactQuery = {
  readonly nif: string
  readonly email: string
  /** International form with a `00` prefix, as the sede posts it: `0034600000000`. */
  readonly telefono: string
}
