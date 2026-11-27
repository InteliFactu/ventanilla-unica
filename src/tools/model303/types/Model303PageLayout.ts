import type { Model303FieldGroup } from './Model303FieldGroup'

/** A tab in the AEAT workbook, including the opening and closing tags. */
export type Model303PageLayout = {
  readonly tag: string
  readonly length: number
  readonly fields: readonly Model303FieldGroup[]
}
