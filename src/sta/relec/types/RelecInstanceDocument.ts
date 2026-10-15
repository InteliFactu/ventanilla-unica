import type { RelecFile } from './RelecFile'
import type { RelecSlot } from './RelecSlot'

/** A checked PDF and the form row it would be attached to. */
export type RelecInstanceDocument = RelecFile & {
  readonly slot: RelecSlot
}
