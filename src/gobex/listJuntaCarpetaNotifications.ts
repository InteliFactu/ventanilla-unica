import type { HttpClient } from '../http/types/HttpClient'
import { searchGobexReport } from './fetchers/searchGobexReport'
import { gobexUrls } from './session/gobexUrls'
import { loginWithClave } from './session/loginWithClave'
import type { JuntaCarpetaNotifications } from './types/JuntaCarpetaNotifications'

/**
 * The holder's notifications in the Carpeta Ciudadana, every state, listed
 * and never opened, with how many are still pending.
 */
export const listJuntaCarpetaNotifications = async (
  client: HttpClient,
): Promise<JuntaCarpetaNotifications> => {
  await loginWithClave(client)
  const { rows: notifications } = await searchGobexReport(
    client,
    gobexUrls.notifications,
    (form) => ({ [`${form}:estado`]: '' }),
  )
  return {
    notifications,
    pending: notifications.filter((row) =>
      /^Pendiente/i.test(row['status'] ?? ''),
    ).length,
  }
}
