import type { SelectOption } from '../../../html/types/SelectOption'

/** A visible control, without its prefilled personal value or session tokens. */
export type YouthGuaranteeField = {
  readonly name: string
  readonly label: string
  readonly type: string
  readonly required: boolean
  readonly readOnly: boolean
  readonly options: readonly SelectOption[]
}
