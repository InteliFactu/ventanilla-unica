import type { YouthGuaranteeDocument } from './YouthGuaranteeDocument'
import type { YouthGuaranteePage } from './YouthGuaranteePage'
import type { YouthGuaranteeStatus } from './YouthGuaranteeStatus'

export type YouthGuaranteeResult = YouthGuaranteeStatus & {
  readonly documents: readonly YouthGuaranteeDocument[]
  readonly form: readonly YouthGuaranteePage[]
}
