import type { FilingRole } from './FilingRole'

/** `aeat aportar`: the CSV of the notification answered, the role, the contact data and the files with their type codes. */
export type DocumentFilingQuery = {
  readonly csv: string
  readonly role: FilingRole
  readonly subject: string
  readonly phone: string
  readonly email?: string | undefined
  readonly files: readonly { readonly path: string; readonly type: string }[]
}
