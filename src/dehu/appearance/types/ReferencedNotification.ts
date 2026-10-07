import type { Notification } from '../../notifications/types/Notification'

/** A pending notification whose sent reference is known, the key every appearance call is made by. */
export type ReferencedNotification = Notification & {
  readonly reference: string
}
