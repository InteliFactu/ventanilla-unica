import type { StaRole } from './StaRole'

/** The role and tab a notification dataset belongs to. */
export type StaNotificationScope = {
  readonly role: StaRole
  readonly tab: string
}
