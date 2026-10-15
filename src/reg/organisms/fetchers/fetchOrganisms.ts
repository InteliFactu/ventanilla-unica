import type { HttpClient } from '../../../http/types/HttpClient'
import { callRegApi } from '../../session/fetchers/callRegApi'
import type { OrganismSearch } from '../types/OrganismSearch'

/** The DIR3 units whose name matches `text`, as the "Datos de solicitud" step's search box finds them. */
export const fetchOrganisms = async (
  client: HttpClient,
  token: string,
  text: string,
): Promise<OrganismSearch> =>
  (await callRegApi(
    client,
    token,
    `dir3/search?searchText=${encodeURIComponent(text)}`,
  )) as OrganismSearch
