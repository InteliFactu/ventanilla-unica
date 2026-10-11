/** What the Carpeta holds for its alerts: the email, whether it is verified, and the alerts switched on. */
export type AlertSettings = {
  readonly email: string | null
  readonly verifiedEmail: string | null
  readonly emailState: string | null
  readonly activeAlerts: readonly string[]
}
