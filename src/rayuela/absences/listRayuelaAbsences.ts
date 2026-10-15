import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaAbsences } from './parsers/parseRayuelaAbsences'
import type { RayuelaAbsence } from './types/RayuelaAbsence'
/** Read the Rayuela absences page through the password session. */
export const listRayuelaAbsences = async (
  client: HttpClient,
  child?: string,
): Promise<RayuelaAbsence[]> =>
  parseRayuelaAbsences(await fetchRayuelaPage(client, 'RegFalAsi', child))
