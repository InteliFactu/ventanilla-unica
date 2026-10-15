import type { RelecInstanceDocument } from './RelecInstanceDocument'
import type { RelecParty } from './RelecParty'

/** What a `caceres instancia` would file, as read from the sede's own form. */
export type RelecInstancePlan = {
  readonly host: string
  readonly procedure: string
  readonly subject: string
  readonly filer: RelecParty
  /** The entity filed for, or undefined when the holder files in their own name. */
  readonly represented?: RelecParty | undefined
  readonly email?: string | undefined
  readonly phone?: string | undefined
  readonly documents: readonly RelecInstanceDocument[]
  /** Names of the rows the sede marks required that no document fills. */
  readonly missingRequired: readonly string[]
}
