import type { WriteResult } from '../../../write/types/WriteResult'
import type { RelecReceipt } from './RelecReceipt'
import type { RelecTramitePlan } from './RelecTramitePlan'

/** The plan or registered receipt of caceres tramite. */
export type RelecTramiteResult = WriteResult<RelecReceipt> & {
  readonly filing: RelecTramitePlan
}
