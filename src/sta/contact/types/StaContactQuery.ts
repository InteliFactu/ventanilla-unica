/** The contact data an STA sede asks a new holder to confirm: a phone (optional) and an e-mail (required). */
export type StaContactQuery = {
  readonly phone: string
  readonly email: string
}
