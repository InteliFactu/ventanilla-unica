import type { WriteResult } from '../../../write/types/WriteResult'
import type { NotaCompany } from './NotaCompany'
import type { NotaReceipt } from './NotaReceipt'

/** The answer of `registradores nota`: the write result plus what the read-only walk found. */
export type NotaResult = WriteResult<NotaReceipt> & {
  readonly company: Omit<NotaCompany, 'documentId'>
  readonly accountsDepositAvailable: boolean
}
