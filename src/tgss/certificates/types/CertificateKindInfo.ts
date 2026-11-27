/** What the entry screen says about one certificate option: its `certificado` value and the portal's own label. */
export type CertificateKindInfo = {
  /** The `certificado` value the Continuar POST carries. */
  readonly value: string
  /** The portal's on-screen label (`descPantalla`), verbatim. */
  readonly label: string
  /** What the certificate is for, in English. */
  readonly purpose: string
  /** The portal asks for an earlier reference date. */
  readonly needsDate: boolean
  /** Name of the visible date control in the portal's Continuar form. */
  readonly dateField?: string
  /** The portal asks for the NIF of the contracting entity. */
  readonly needsContractingEntity: boolean
  /** Name of the visible contracting entity control in the Continuar form. */
  readonly contractingEntityField?: string
}
