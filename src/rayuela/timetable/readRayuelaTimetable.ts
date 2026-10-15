import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaTimetable } from './parsers/parseRayuelaTimetable'
import type { RayuelaTimetable } from './types/RayuelaTimetable'
/** Read the Rayuela timetable page through the password session. */
export const readRayuelaTimetable = async (
  client: HttpClient,
  child?: string,
): Promise<RayuelaTimetable> =>
  parseRayuelaTimetable(await fetchRayuelaPage(client, 'HoraAlumno', child))
