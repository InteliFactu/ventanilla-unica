import type { WriteResult } from '../../../write/types/WriteResult'
import type { AccountPaymentReceipt } from './AccountPaymentReceipt'

/** The `aeat pagar` answer: the write result plus the census name the AEAT put on the payment. */
export type AccountPaymentPlan = WriteResult<AccountPaymentReceipt> & {
  readonly titular?: string | undefined
}
