import type { HttpClient } from '../../../http/types/HttpClient'
import { carpetaUrls } from '../../session/carpetaUrls'

/** GET the alert settings with the Carpeta token, as JSON text. */
export const fetchAlertSettings = async (
  client: HttpClient,
  token: string,
): Promise<string> => {
  const response = await client.request(carpetaUrls.alertSettings, {
    headers: { Authorization: token, Accept: 'application/json' },
  })
  if (response.status !== 200)
    throw new Error(
      `Carpeta: configuracionAvisos answered HTTP ${String(response.status)}`,
    )
  return response.text
}
