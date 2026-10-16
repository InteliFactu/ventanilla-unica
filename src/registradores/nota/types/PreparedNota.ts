import type { BillingPlace } from './BillingPlace'
import type { NotaCompany } from './NotaCompany'
import type { NotaRepresentative } from './NotaRepresentative'

/** The state after the read-only walk: the company chosen and the identification page reached. */
export type PreparedNota = {
  readonly csrf: string
  readonly company: NotaCompany
  /** False when the sede says the company 'no tiene depósito de cuentas disponibles'. */
  readonly accountsDepositAvailable: boolean
  readonly representative: NotaRepresentative
  readonly place: BillingPlace
  /** The identification form, with every field the order would post. */
  readonly identification: Readonly<Record<string, string>>
}
