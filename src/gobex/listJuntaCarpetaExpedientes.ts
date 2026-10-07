import type { HttpClient } from '../http/types/HttpClient'
import { searchGobexReport } from './fetchers/searchGobexReport'
import { slashDateWindows } from './mappers/slashDateWindows'
import { gobexUrls } from './session/gobexUrls'
import { loginWithClave } from './session/loginWithClave'
import type { GobexDateRange } from './types/GobexDateRange'
import type { GobexRecord } from './types/GobexRecord'
import type { JuntaCarpetaExpedientes } from './types/JuntaCarpetaExpedientes'

/**
 * The holder's expedientes in the Carpeta Ciudadana started between `desde`
 * and `hasta` (`dd/mm/aaaa`), every state. The sede refuses a search wider
 * than 30 days ("temporalmente"), so the range is swept one window at a time.
 */
export const listJuntaCarpetaExpedientes = async (
  client: HttpClient,
  range: GobexDateRange,
): Promise<JuntaCarpetaExpedientes> => {
  const windows = slashDateWindows(range.desde, range.hasta, 30)
  await loginWithClave(client)
  const expedientes = new Map<string, GobexRecord>()
  for (const window of windows) {
    const { rows } = await searchGobexReport(
      client,
      gobexUrls.expedientes,
      (form) => ({
        [`${form}:estadoTramite`]: '9',
        [`${form}:fechaDesdeExpInputDate`]: window.desde,
        [`${form}:fechaHastaExpInputDate`]: window.hasta,
      }),
    )
    for (const row of rows)
      expedientes.set(row['expediente'] ?? JSON.stringify(row), row)
  }
  return { ...range, expedientes: [...expedientes.values()] }
}
