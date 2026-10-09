import type { RelecDocument } from './RelecDocument'
import type { RelecParty } from './RelecParty'

/** What a confirmed `caceres aportar` would file, as read from the sede's own form. */
export type RelecPlan = {
  readonly host: string
  readonly procedure: string
  readonly reference: string
  readonly information: string
  readonly representative: RelecParty
  readonly represented: RelecParty & { readonly dboid: string }
  readonly notification: 'electronica'
  readonly email: string
  readonly phone?: string | undefined
  readonly documents: readonly RelecDocument[]
}
