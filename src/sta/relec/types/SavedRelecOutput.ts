import type { RelecReceipt } from './RelecReceipt'

/** A registered filing after the attempt to save its output, with a note when that failed. */
export type SavedRelecOutput = {
  readonly receipt: RelecReceipt
  readonly notes: readonly string[]
}
