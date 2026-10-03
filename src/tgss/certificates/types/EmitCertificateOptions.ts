/** Optional inputs of one up-to-date certificate emission. */
export type EmitCertificateOptions = {
  /** Directory to write the PDF into; nothing is written without it. */
  readonly outDir?: string | undefined
  /** NIF of the contracting entity, required by the tender kinds. */
  readonly contractingEntityNif?: string | undefined
}
