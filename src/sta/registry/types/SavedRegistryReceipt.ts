import type { StaRegistryReceipt } from './StaRegistryReceipt'

/** A registered entry after the attempt to save its justificante, with a note when that failed. */
export type SavedRegistryReceipt = {
  readonly receipt: StaRegistryReceipt
  readonly notes: readonly string[]
}
