import { mapAlertPreference } from '../mappers/mapAlertPreference'
import type { AlertSettings } from '../types/AlertSettings'
import type { NoticeDays } from '../types/NoticeDays'
import type { PreferencesBody } from '../types/PreferencesBody'

/**
 * Build a proposed full-calendar update using the front's save-field names.
 * Keep the observed settings, including explicit zeroes, for unselected groups.
 */
export const buildPreferencesBody = (
  settings: AlertSettings,
  levels: readonly number[],
  days: NoticeDays,
): PreferencesBody => ({
  prefAlertas: settings.groups.map((group) =>
    mapAlertPreference(group, levels, days),
  ),
  prefEmail: settings.email ?? '',
  prefEmailVerif: settings.verifiedEmail,
})
