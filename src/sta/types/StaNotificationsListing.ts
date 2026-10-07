import type { StaNotification } from './StaNotification'

/** The holder's notifications at an STA sede, the host and how many are pending. */
export type StaNotificationsListing = {
  readonly host: string
  readonly pending: number
  readonly notifications: readonly StaNotification[]
}
