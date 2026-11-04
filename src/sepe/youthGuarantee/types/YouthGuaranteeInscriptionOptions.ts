import type { YouthGuaranteeVerificationFiles } from './YouthGuaranteeVerificationFiles'

export type YouthGuaranteeInscriptionOptions =
  YouthGuaranteeVerificationFiles & {
    readonly out?: string | undefined
  }
