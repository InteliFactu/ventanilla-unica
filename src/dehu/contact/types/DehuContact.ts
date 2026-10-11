/** The contact data DEHU mails its notices to: up to five emails (each confirmed or not), a phone, the notice schedule. */
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
