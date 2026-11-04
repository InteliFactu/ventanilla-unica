import type { YouthGuaranteeField } from './YouthGuaranteeField'

export type YouthGuaranteePage = {
  readonly step: number
  readonly title: string
  readonly fields: readonly YouthGuaranteeField[]
}
