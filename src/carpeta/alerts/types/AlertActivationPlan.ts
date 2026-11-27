import type { PreferencesBody } from './PreferencesBody'

/** Preview of the calendar configuration with no remote write. */
export type AlertActivationPlan = {
  readonly sent: false
  readonly body: PreferencesBody
}
