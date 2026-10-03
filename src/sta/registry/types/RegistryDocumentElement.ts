/** A document group of the form and the slots (document types) it accepts. */
export type RegistryDocumentElement = {
  readonly id: string
  readonly documents: readonly { readonly id: string }[]
}
