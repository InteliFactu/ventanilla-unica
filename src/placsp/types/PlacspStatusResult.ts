/** The answer of `placsp estado`. */
export type PlacspStatusResult = {
  readonly email: string
  /**
   * `none`: the portal says the e-mail is free to register. `exists`: it says
   * the e-mail is taken (an operator account uses it). `unknown`: neither.
   */
  readonly account: 'none' | 'exists' | 'unknown'
  /** What the portal said next to the e-mail field, verbatim. */
  readonly message?: string | undefined
  readonly notes: readonly string[]
}
