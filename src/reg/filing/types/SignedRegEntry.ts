/** `registry/signCertificate/:uuid`; `sign` is false when the certificate is not the holder's. */
export type SignedRegEntry = {
  readonly uuid: string
  readonly sign: boolean
}
