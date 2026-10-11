import type { HttpClient } from '../../http/types/HttpClient'
import { loginWithCertificate } from '../session/loginWithCertificate'
import { fetchAlertSettings } from './fetchers/fetchAlertSettings'
import { mapAlertSettings } from './mappers/mapAlertSettings'
import type { AlertSettings } from './types/AlertSettings'

/** `carpeta avisos`: the email and alerts the holder's Carpeta Ciudadana holds. Read-only. */
export const readAlertSettings = async (
  client: HttpClient,
): Promise<AlertSettings> => {
  const token = await loginWithCertificate(client)
  return mapAlertSettings(JSON.parse(await fetchAlertSettings(client, token)))
}
