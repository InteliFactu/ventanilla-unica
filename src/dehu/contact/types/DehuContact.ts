/** DEHU contact fields and the confirmation status reported for each notice email. */
export type DehuContact = {
  readonly nif: string
  readonly emails: readonly {
    readonly email: string
    readonly confirmed: boolean
  }[]
  readonly phone: string | null
  readonly noticeTime: string | null
  readonly updatedAt: string | null
}
