/** What the step-1 form carries besides the files: subject, contact data and, filing for a third party, the interesado's NIF. */
export type FilingContact = {
  readonly subject: string
  readonly phone: string
  readonly email?: string | undefined
  readonly nif?: string | undefined
}
