import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchAlertSettings } from './fetchers/fetchAlertSettings'
import { mapAlertSettings } from './mappers/mapAlertSettings'
import { readSuccessfulAlertPreferences } from './parsers/readSuccessfulAlertPreferences'
import type { AlertSettings } from './types/AlertSettings'

/** `carpeta avisos`: the email and alerts the holder's Carpeta Ciudadana holds. Read-only. */
export const readAlertSettings = async (
  client: HttpClient,
): Promise<AlertSettings> => {
  const token = await loginWithCertificate(client)
  const body: unknown = JSON.parse(await fetchAlertSettings(client, token))
  readSuccessfulAlertPreferences(body)
  return mapAlertSettings(body)
}
