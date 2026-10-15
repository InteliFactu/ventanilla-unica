/** The bearer pair the Cl@ve relay hands back in the `logincheck` query. */
export type RegTokens = {
  readonly token: string
  readonly refreshToken: string
}
