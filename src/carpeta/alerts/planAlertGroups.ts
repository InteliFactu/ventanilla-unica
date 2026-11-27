import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { buildPreferencesBody } from './builders/buildPreferencesBody'
import { fetchAlertSettings } from './fetchers/fetchAlertSettings'
import { mapAlertSettings } from './mappers/mapAlertSettings'
import type { AlertActivationPlan } from './types/AlertActivationPlan'
import type { NoticeDays } from './types/NoticeDays'
import { validateActivation } from './validators/validateActivation'
import { validateAlertLevels } from './validators/validateAlertLevels'
import { validateAlertSnapshot } from './validators/validateAlertSnapshot'
import { validateNoticeDays } from './validators/validateNoticeDays'

/** Read current settings and show the proposed change to alert email groups. */
export const planAlertGroups = async (
  client: HttpClient,
  levels: readonly number[],
  days: NoticeDays,
): Promise<AlertActivationPlan> => {
  validateAlertLevels(levels)
  validateNoticeDays(days)
  const token = await loginWithCertificate(client)
  const body: unknown = JSON.parse(await fetchAlertSettings(client, token))
  validateAlertSnapshot(body)
  const settings = mapAlertSettings(body)
  validateActivation(settings, levels)
  return { sent: false, body: buildPreferencesBody(settings, levels, days) }
}
