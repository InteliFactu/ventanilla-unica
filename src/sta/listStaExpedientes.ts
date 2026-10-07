import type { HttpClient } from '../http/types/HttpClient'
import { fetchStaPage } from './fetchers/fetchStaPage'
import { fetchStaTab } from './fetchers/fetchStaTab'
import { mapExpediente } from './mappers/mapExpediente'
import { openStaSession } from './session/openStaSession'
import { staOrigins } from './session/staOrigins'
import type { StaExpedientesListing } from './types/StaExpedientesListing'
import type { StaPortal } from './types/StaPortal'

/** The holder's expedientes at an STA sede, open and archived. */
export const listStaExpedientes = async (
  client: HttpClient,
  portal: StaPortal,
): Promise<StaExpedientesListing> => {
  const origin = staOrigins[portal]
  await openStaSession(client, origin)
  const open = await fetchStaPage(client, origin, 'EXPEDIENTES_FULL')
  const archived = await fetchStaTab(client, origin, {
    pageCode: 'EXPEDIENTES_FULL',
    screenId: 'EXPEDIENTES_FULL',
    tabber: 'TABBER',
    tab: 'ARCHIVADOS',
  })
  return {
    host: new URL(origin).hostname,
    expedientes: [
      ...(open['EXPEDIENTES_FULL_ENCURSO'] ?? []).map((row) =>
        mapExpediente(row, false),
      ),
      ...(archived['EXPEDIENTES_FULL_ARCHIVADOS'] ?? []).map((row) =>
        mapExpediente(row, true),
      ),
    ],
  }
}
