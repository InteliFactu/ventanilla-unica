import type { YouthGuaranteeContactIntent } from './YouthGuaranteeContactIntent'

export type YouthGuaranteeVerificationFiles = {
  readonly pinFile?: string | undefined
  readonly linkFile?: string | undefined
  readonly mobileIntent?: YouthGuaranteeContactIntent | undefined
  readonly emailIntent?: YouthGuaranteeContactIntent | undefined
}
