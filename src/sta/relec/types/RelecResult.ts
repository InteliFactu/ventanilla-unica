import type { WriteResult } from '../../../write/types/WriteResult'
import type { RelecPlan } from './RelecPlan'
import type { RelecReceipt } from './RelecReceipt'

/** The answer of `caceres aportar`: the write result plus the structured filing it planned. */
export type RelecResult = WriteResult<RelecReceipt> & {
  readonly filing: RelecPlan
}
