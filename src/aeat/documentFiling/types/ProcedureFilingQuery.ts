/** `aeat escrito`: the trámite code, the interesado's NIF when filing for a third party, the contact data and the files with their type codes. */
export type ProcedureFilingQuery = {
  readonly tramite: string
  readonly nif?: string | undefined
  readonly subject: string
  readonly phone: string
  readonly email?: string | undefined
  readonly files: readonly { readonly path: string; readonly type: string }[]
}
