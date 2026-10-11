/** The answer of `carpeta email`: the address, and what the Carpeta said when asked to verify it. */
export type EmailVerification = {
  readonly email: string
  readonly requested: boolean
  readonly ok?: boolean | undefined
  readonly message?: string | undefined
}
