import type { HttpResponse } from '../../../http/types/HttpResponse'
import type { NotaCompany } from './NotaCompany'

/** Where the read-only walk stops: the identification page, with what was learnt on the way. */
export type IdentificationStep = {
  readonly csrf: string
  readonly company: NotaCompany
  readonly accountsDepositAvailable: boolean
  readonly page: HttpResponse
}
