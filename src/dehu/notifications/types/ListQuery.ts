import type { ListState } from './ListState'

/** What one `listNotifications` call reads: which states, and the year a realized sweep covers. */
export type ListQuery = {
  readonly state: ListState
  readonly year?: number | undefined
  /** Reject a DEHU session whose authenticated holder differs from this NIF. */
  readonly expectedNif?: string | undefined
}
