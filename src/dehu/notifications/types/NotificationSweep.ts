import type { Notification } from './Notification'

/** The notifications one paged sweep collected and how many pages it read. */
export type NotificationSweep = {
  readonly notifications: readonly Notification[]
  readonly pages: number
}
