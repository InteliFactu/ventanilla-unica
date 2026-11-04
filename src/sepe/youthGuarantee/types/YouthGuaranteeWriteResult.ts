import type { WriteResult } from '../../../write/types/WriteResult'
import type { YouthGuaranteeReceipt } from './YouthGuaranteeReceipt'
import type { YouthGuaranteeResult } from './YouthGuaranteeResult'

export type YouthGuaranteeWriteResult = WriteResult<YouthGuaranteeReceipt> & {
  readonly current: YouthGuaranteeResult
}
