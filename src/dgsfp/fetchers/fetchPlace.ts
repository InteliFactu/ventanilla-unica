import type { HttpClient } from '../../http/types/HttpClient'
import { selectListEntry } from '../selectors/selectListEntry'
import type { DgsfpKeyValue } from '../types/DgsfpKeyValue'
import type { DgsfpPlace } from '../types/DgsfpPlace'
import { callDgsfpService } from './callDgsfpService'

/**
 * Resolve the notification address against the sede's own lists: the
 * `Provincias` master table, then the municipalities service the province
 * list calls on change (service 35, `ObtenerMunicipios?codProvincia=`).
 */
export const fetchPlace = async (
  client: HttpClient,
  digest: string,
  wanted: { readonly province: string; readonly municipality: string },
): Promise<DgsfpPlace> => {
  const provinces = (await callDgsfpService(
    client,
    digest,
    'GFRestService.svc/obtenerElementosTablaMaestra?nt=Provincias',
  )) as readonly DgsfpKeyValue[]
  const province = selectListEntry(provinces, wanted.province, 'province')
  const answer = (await callDgsfpService(
    client,
    digest,
    `GFRestService.svc/ObtenerMunicipios?codProvincia=${encodeURIComponent(province.key)}`,
  )) as { readonly municipios: readonly DgsfpKeyValue[] }
  const municipality = selectListEntry(
    answer.municipios,
    wanted.municipality,
    'municipality',
  )
  return { province, municipality }
}
