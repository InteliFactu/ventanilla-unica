import type { AlertGroup } from './AlertGroup'

/** What the Carpeta holds for its alerts: the email, whether it is verified, the alerts switched on, and every group. */
export type AlertSettings = {
  readonly email: string | null
  readonly verifiedEmail: string | null
  readonly emailState: string | null
  readonly activeAlerts: readonly string[]
  readonly groups: readonly AlertGroup[]
}
