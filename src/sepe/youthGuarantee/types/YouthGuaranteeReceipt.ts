import type { YouthGuaranteeDocument } from './YouthGuaranteeDocument'

export type YouthGuaranteeReceipt = {
  readonly registrationNumber: string | null
  readonly registered: boolean
  readonly responseText: string
  readonly documents: readonly YouthGuaranteeDocument[]
}
