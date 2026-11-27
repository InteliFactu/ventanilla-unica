import type { FixedWidthField } from './FixedWidthField'

/** A record design: its total length and its fields; positions no field covers stay blank. */
export type FixedWidthSchema = {
  readonly recordLength: number
  readonly fields: readonly FixedWidthField[]
}
