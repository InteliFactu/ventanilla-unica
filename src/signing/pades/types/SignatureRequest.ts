import type { SignatureDetails } from './SignatureDetails'

/** A signature's details and where it goes: a new field on a page, or an existing empty one. */
export type SignatureRequest = SignatureDetails & {
  /** The stamp's text lines; no stamp (an invisible signature) when absent. */
  readonly stampLines: readonly string[] | undefined
  /** 1-based page of a new field; negative counts from the end (-1 is the last). */
  readonly page: number
  /** The stamp's [llx lly urx ury] on that page. */
  readonly rect: readonly number[]
  /** The /T of an existing empty signature field to fill instead of adding one. */
  readonly field: string | undefined
}
