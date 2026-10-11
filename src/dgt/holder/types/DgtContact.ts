/** The holder's contact data at the DGT (the SAVI subscription), as stored. */
export type DgtContact = {
  readonly email: string
  /** As the DGT keeps it: international form with a `00` prefix, e.g. `0034600000000`. */
  readonly telefono: string
}
