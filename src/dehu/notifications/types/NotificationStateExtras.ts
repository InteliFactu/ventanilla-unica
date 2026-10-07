import type { NotificationState } from './NotificationState'

/** The state and optional raw state and expiry a notification is mapped with. */
export type NotificationStateExtras = {
  readonly state: NotificationState
  readonly rawState?: string | undefined
  readonly expiresAt?: string | undefined
}
