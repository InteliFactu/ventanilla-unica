import type { HttpClient } from '../http/types/HttpClient'
import { fetchStaPage } from './fetchers/fetchStaPage'
import { fetchStaTab } from './fetchers/fetchStaTab'
import { mapRegistration } from './mappers/mapRegistration'
import { openStaSession } from './session/openStaSession'
import { staOrigins } from './session/staOrigins'
import type { StaPortal } from './types/StaPortal'
import type { StaRegistrationsListing } from './types/StaRegistrationsListing'

/** The holder's registry entries (anotaciones) at an STA sede, own and as representative. */
export const listStaRegistrations = async (
  client: HttpClient,
  portal: StaPortal,
): Promise<StaRegistrationsListing> => {
  const origin = staOrigins[portal]
  await openStaSession(client, origin)
  const own = await fetchStaPage(client, origin, 'ANOTACIONES')
  const represented = await fetchStaTab(client, origin, {
    pageCode: 'ANOTACIONES',
    screenId: 'ANOTACION',
    tabber: 'TABBER',
    tab: 'REPRESENTANTE',
  })
  return {
    host: new URL(origin).hostname,
    registrations: [
      ...(own['ANOTACION_INTERESADO'] ?? []).map((row) =>
        mapRegistration(row, 'interesado'),
      ),
      ...(represented['ANOTACION_REPRESENTANTE'] ?? []).map((row) =>
        mapRegistration(row, 'representante'),
      ),
    ],
  }
}
