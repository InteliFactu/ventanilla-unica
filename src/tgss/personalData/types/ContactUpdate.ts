/** The contact data to leave at the Seguridad Social; `landline` undefined keeps the current one. */
export type ContactUpdate = {
  readonly mobile: string
  readonly email: string
  readonly landline?: string | undefined
}
