/** The holder's "Datos personales" at an STA sede: contact ways, whether they are confirmed, identity and addresses. */
export type StaContactData = {
  readonly host: string
  readonly phone?: string | undefined
  readonly email?: string | undefined
  /** False while the sede still asks "¿Los medios de contacto son correctos?". */
  readonly confirmed: boolean
  readonly name?: string | undefined
  readonly nif?: string | undefined
  readonly address?: string | undefined
  readonly otherAddresses: readonly string[]
}
