import type { GobexRecord } from './GobexRecord'

/** The holder's Carpeta Ciudadana notifications and how many are still pending. */
export type JuntaCarpetaNotifications = {
  readonly notifications: readonly GobexRecord[]
  readonly pending: number
}
