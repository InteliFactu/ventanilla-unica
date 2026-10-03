/** What the entry screen says about one certificate option: its `certificado` value and the portal's own label. */
export type CertificateKindInfo = {
  /** The `certificado` value the Continuar POST carries. */
  readonly value: string
  /** The portal's on-screen label (`descPantalla`), verbatim. */
  readonly label: string
  /** What the certificate is for, in English. */
  readonly purpose: string
  /** The portal asks for a reference date the package does not send yet. */
  readonly needsDate: boolean
  /** The portal asks for the NIF of the contracting entity (`nifEntidadContratante`). */
  readonly needsContractingEntity: boolean
}
