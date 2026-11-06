/** Whose certificate opened the payment form: the page prints it as nifCert and nomCert. */
export type CertificateHolder = {
  readonly nif: string
  readonly nombre: string
}
