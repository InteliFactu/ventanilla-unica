import type { AlertPreference } from './AlertPreference'

/** The body of `/api/v3/preferencias-usuario`: every group, and the alert email with its verified copy. */
export type PreferencesBody = {
  readonly prefAlertas: readonly AlertPreference[]
  readonly prefEmail: string
  readonly prefEmailVerif: string | null
}
