/** The outcome of an email change request: planned only, or filed with Red.es's answer. */
export type ContactEmailChange = {
  readonly identificador: string
  readonly email: string
  readonly submitted: boolean
  /** Red.es's answer once filed; the change still waits for the registry's approval. */
  readonly message?: string | undefined
}
