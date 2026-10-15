import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaChildren } from './parsers/parseRayuelaChildren'
import type { RayuelaChild } from './types/RayuelaChild'
/** Read the Rayuela children page through the password session. */
export const listRayuelaChildren = async (
  client: HttpClient,
): Promise<RayuelaChild[]> =>
  parseRayuelaChildren(await fetchRayuelaPage(client, 'DetDatMisHij'))
