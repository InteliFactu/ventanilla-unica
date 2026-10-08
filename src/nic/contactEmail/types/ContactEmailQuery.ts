/** Which ES-NIC contact gets which new email. */
export type ContactEmailQuery = {
  /** The contact handle, e.g. `1727AF1-ESNIC-F5`. */
  readonly identificador: string
  readonly email: string
}
