/** Where to read the certificate and key PEM files from, each falling back to the environment. */
export type CertificatePaths = {
  readonly cert?: string | undefined
  readonly key?: string | undefined
}
