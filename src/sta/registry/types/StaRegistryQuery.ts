/** One general-registry filing: the addressee unit, a contact phone, the subject line and the PDFs to attach. */
export type StaRegistryQuery = {
  /** DIR3 code of the addressee unit, e.g. `A11030071`. */
  readonly destination: string
  readonly phone: string
  readonly subject: string
  readonly documents: readonly string[]
}
