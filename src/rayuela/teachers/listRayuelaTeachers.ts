import type { HttpClient } from '../../http/types/HttpClient'
import { fetchRayuelaPage } from '../session/fetchers/fetchRayuelaPage'
import { parseRayuelaTeachers } from './parsers/parseRayuelaTeachers'
import type { RayuelaTeachers } from './types/RayuelaTeachers'
/** Read the Rayuela teachers page through the password session. */
export const listRayuelaTeachers = async (
  client: HttpClient,
  child?: string,
): Promise<RayuelaTeachers> =>
  parseRayuelaTeachers(await fetchRayuelaPage(client, 'RegDatPro', child))
