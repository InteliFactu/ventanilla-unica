import type { NotaCompany } from './NotaCompany'

/** The company selected in the search, and whether its accounts deposit is available. */
export type CompanyChoice = {
  readonly company: NotaCompany
  readonly accountsDepositAvailable: boolean
}
