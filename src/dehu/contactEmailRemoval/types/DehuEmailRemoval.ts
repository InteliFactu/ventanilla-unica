/** What `dehu quitar-email` did, or would do without `--confirmar si`. */
export type DehuEmailRemoval = {
  readonly nif: string
  readonly removed: string
  /** The emails left after the removal, in slot order, each with DEHU's own confirmation flag. */
  readonly remaining: readonly {
    readonly email: string
    readonly confirmed: boolean
  }[]
  /** False in plan mode: nothing was sent to DEHU. */
  readonly applied: boolean
  /** When applied, true once a fresh read no longer lists the removed email. */
  readonly verified: boolean
}
