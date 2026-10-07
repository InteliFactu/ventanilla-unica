import type { ListState } from './ListState'
import type { Notification } from './Notification'

/** The result of one `listNotifications` call: the state asked for, the notifications, their count and the pages read. */
export type NotificationListing = {
  readonly state: ListState
  readonly notifications: readonly Notification[]
  readonly count: number
  readonly pages: number
}
